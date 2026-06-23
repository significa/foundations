#!/usr/bin/env node
/**
 * Verifies that every component's `page.mdx` declares all its cross-Foundations
 * imports under the `dependencies` frontmatter key. Fails CI on drift.
 *
 * Run as part of `pnpm check`.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const FOUNDATIONS_DIR = "src/foundations";

/**
 * Imports skipped because they're provided by the setup guide
 * (`src/foundations/setup/page.mdx`) — not consumer-facing dependencies.
 */
const SETUP_PROVIDED_PREFIXES = ["@/lib/"];

/** Recursively find all files matching `name` under `dir`. */
const findFiles = async (dir, name, results = []) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findFiles(full, name, results);
    } else if (entry.name === name) {
      results.push(full);
    }
  }
  return results;
};

/**
 * Parse the subset of YAML frontmatter we care about: `files` (string list) and
 * `dependencies` (list of `{ name, href }` objects). Doesn't claim to be a full
 * YAML parser — it's enough for the canonical shape used in Foundations pages.
 */
const parseFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return { files: [], dependencies: [] };
  const fm = match[1];

  // files: list of bare strings
  const files = [];
  const filesBlock = fm.match(/^files:\s*\n((?:[ \t]+-[^\n]+\n?)+)/m);
  if (filesBlock) {
    for (const line of filesBlock[1].split("\n")) {
      const m = line.match(/^[ \t]+-\s+(.+?)\s*$/);
      if (m) files.push(m[1]);
    }
  }

  // dependencies: list of { name, href } objects
  const dependencies = [];
  const depsBlock = fm.match(/^dependencies:\s*\n((?:[ \t]+(?:-\s+name|href):[^\n]+\n?)+)/m);
  if (depsBlock) {
    // Each entry is `- name: X\n  href: Y` (allowing quoted values)
    const entryRegex =
      /-\s+name:\s+(?:"([^"]*)"|'([^']*)'|([^\n]+))\s*\n\s+href:\s+(?:"([^"]*)"|'([^']*)'|([^\n]+))/g;
    for (const m of depsBlock[1].matchAll(entryRegex)) {
      const name = (m[1] ?? m[2] ?? m[3] ?? "").trim();
      const href = (m[4] ?? m[5] ?? m[6] ?? "").trim();
      if (name && href) dependencies.push({ name, href });
    }
  }

  return { files, dependencies };
};

const extractFoundationsImports = (content) => {
  const imports = new Set();
  const importRegex = /from\s+['"](@\/foundations\/[^'"]+|@\/lib\/[^'"]+)['"]/g;
  for (const m of content.matchAll(importRegex)) {
    imports.add(m[1]);
  }
  return [...imports];
};

/**
 * Map an import path like `@/foundations/ui/popover/popover` to `ui/popover`
 * (matching the canonical `href` declared in `dependencies` frontmatter).
 */
const importToCanonicalPath = (importPath) => {
  const stripped = importPath.replace(/^@\/foundations\//, "");
  const parts = stripped.split("/");
  if (parts.length < 2) return null;
  return `${parts[0]}/${parts[1]}`;
};

const isSkippableImport = (importPath) =>
  SETUP_PROVIDED_PREFIXES.some((prefix) => importPath.startsWith(prefix));

const main = async () => {
  const foundationsAbs = resolve(ROOT, FOUNDATIONS_DIR);
  const pages = await findFiles(foundationsAbs, "page.mdx");

  const errors = [];

  for (const pagePath of pages) {
    const pageDir = dirname(pagePath);
    const ownPath = relative(foundationsAbs, pageDir);

    const content = await readFile(pagePath, "utf-8");
    const { files, dependencies } = parseFrontmatter(content);

    const declared = new Set(
      dependencies
        .filter((d) => d.href.startsWith("/"))
        // Normalize: strip leading slash, trailing slash, and any #anchor suffix
        // (some pages link to a specific utility function, e.g. /utils/math#clamp).
        .map((d) => d.href.replace(/^\//, "").replace(/#.*$/, "").replace(/\/$/, "")),
    );

    const filesToScan =
      files.length > 0 ? files : [`${FOUNDATIONS_DIR}/${ownPath}/${ownPath.split("/").pop()}.tsx`];

    const seen = new Set();
    for (const file of filesToScan) {
      const fileAbs = resolve(ROOT, file);
      let fileContent;
      try {
        fileContent = await readFile(fileAbs, "utf-8");
      } catch {
        continue;
      }
      for (const importPath of extractFoundationsImports(fileContent)) {
        if (isSkippableImport(importPath)) continue;
        const canonical = importToCanonicalPath(importPath);
        if (!canonical) continue;
        if (canonical === ownPath) continue;
        seen.add(canonical);
      }
    }

    const undeclared = [...seen].filter((p) => !declared.has(p));
    if (undeclared.length > 0) {
      const relPage = relative(ROOT, pagePath);
      errors.push(
        `  ${relPage}\n    missing from frontmatter dependencies: ${undeclared
          .map((p) => `/${p}`)
          .join(", ")}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("\nPage dependency drift detected:\n");
    for (const err of errors) console.error(err);
    console.error("\nAdd the missing entries to each page.mdx `dependencies:` block.\n");
    process.exit(1);
  }

  console.log(`✓ Checked ${pages.length} pages — no dependency drift.`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
