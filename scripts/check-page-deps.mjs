#!/usr/bin/env node
/**
 * Verifies that every component's `page.mdx` declares all its cross-Foundations
 * imports under the `dependencies` frontmatter key. Fails CI on drift.
 *
 * Every import is resolved to a real file and attributed to the item (the
 * nearest directory with a `page.mdx`) that owns it, so `#/…`, `./…` and `../…`
 * imports are all caught. Examples are not dependencies and aren't scanned.
 *
 * Run as part of `pnpm check`.
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const SRC_DIR = join(ROOT, "src");
const FOUNDATIONS_DIR = join(SRC_DIR, "foundations");

/**
 * Provided by the setup guide (`src/foundations/setup/page.mdx`), so not
 * consumer-facing dependencies.
 */
const SETUP_PROVIDED_DIR = join(SRC_DIR, "lib");

const SOURCE_FILE = /\.(ts|tsx)$/;
const EXAMPLES_DIR = /^examples?$/;

/** `from "x"`, `import "x"`, `import("x")` */
const IMPORT_REGEX = /(?:\bfrom\s+|\bimport\s*\(?\s*)(["'])([^"']+)\1/g;

const isInside = (dir, path) => path.startsWith(`${dir}${sep}`);

/** All files under `dir`; `skipDir` prunes directories by name. */
const listFiles = async (dir, skipDir = () => false, results = []) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDir(entry.name)) await listFiles(full, skipDir, results);
    } else {
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

  const files = [];
  const filesBlock = fm.match(/^files:\s*\n((?:[ \t]+-[^\n]+\n?)+)/m);
  for (const line of filesBlock?.[1].split("\n") ?? []) {
    const m = line.match(/^[ \t]+-\s+(.+?)\s*$/);
    if (m) files.push(m[1]);
  }

  // Each entry is `- name: X\n  href: Y` (allowing quoted values)
  const dependencies = [];
  const depsBlock = fm.match(/^dependencies:\s*\n((?:[ \t]+(?:-\s+name|href):[^\n]+\n?)+)/m);
  const entryRegex =
    /-\s+name:\s+(?:"([^"]*)"|'([^']*)'|([^\n]+))\s*\n\s+href:\s+(?:"([^"]*)"|'([^']*)'|([^\n]+))/g;
  for (const m of depsBlock?.[1].matchAll(entryRegex) ?? []) {
    const name = (m[1] ?? m[2] ?? m[3] ?? "").trim();
    const href = (m[4] ?? m[5] ?? m[6] ?? "").trim();
    if (name && href) dependencies.push({ name, href });
  }

  return { files, dependencies };
};

/** Absolute path an import points at, or null for packages. */
const resolveImport = (fromFile, specifier) => {
  if (specifier.startsWith("#/")) return join(SRC_DIR, specifier.slice(2));
  if (specifier.startsWith(".")) return resolve(dirname(fromFile), specifier);
  return null;
};

/** The item directory (nearest ancestor with a `page.mdx`) that owns `path`. */
const findOwningItem = (path, itemDirs) => {
  for (let dir = dirname(path); isInside(FOUNDATIONS_DIR, dir); dir = dirname(dir)) {
    if (itemDirs.has(dir)) return dir;
  }
  return null;
};

/** Normalize an internal href: strip leading/trailing slash and any #anchor (e.g. /utils/math#clamp). */
const hrefToItemPath = (href) => href.replace(/^\//, "").replace(/#.*$/, "").replace(/\/$/, "");

/** Source files the item ships: its `files` list plus every non-example .ts/.tsx in its directory. */
const getItemSourceFiles = async (itemDir, files) => {
  const own = await listFiles(itemDir, (name) => EXAMPLES_DIR.test(name));
  return [
    ...new Set([
      ...files.map((file) => resolve(ROOT, file)),
      ...own.filter((file) => SOURCE_FILE.test(file)),
    ]),
  ];
};

/** Problems with one import of an item's source file, if any. */
const checkImport = ({ file, specifier, itemDir, itemDirs, declared }) => {
  const target = resolveImport(file, specifier);
  if (!target) return null;

  const where = `${relative(ROOT, file)} imports "${specifier}"`;
  if (!existsSync(target)) return `${where}, which doesn't exist`;
  if (isInside(SETUP_PROVIDED_DIR, target)) return null;
  if (!isInside(FOUNDATIONS_DIR, target)) return `${where}, which is outside src/foundations`;

  const targetItem = findOwningItem(target, itemDirs);
  if (!targetItem) return `${where}, which no page documents`;
  if (targetItem === itemDir) return null;

  // Hrefs use "/"; relative() uses the OS separator
  const targetPath = relative(FOUNDATIONS_DIR, targetItem).split(sep).join("/");
  if (declared.has(targetPath)) return null;
  return `${where}: add /${targetPath} to frontmatter dependencies`;
};

const checkItem = async (pagePath, itemDirs) => {
  const itemDir = dirname(pagePath);
  const { files, dependencies } = parseFrontmatter(await readFile(pagePath, "utf-8"));
  const declared = new Set(
    dependencies.filter((d) => d.href.startsWith("/")).map((d) => hrefToItemPath(d.href)),
  );

  const problems = [];
  for (const file of await getItemSourceFiles(itemDir, files)) {
    if (!existsSync(file)) {
      problems.push(`${relative(ROOT, file)} is listed in files but doesn't exist`);
      continue;
    }
    const content = await readFile(file, "utf-8");
    for (const [, , specifier] of content.matchAll(IMPORT_REGEX)) {
      const problem = checkImport({ file, specifier, itemDir, itemDirs, declared });
      if (problem) problems.push(problem);
    }
  }
  return problems.map((problem) => `${relative(ROOT, pagePath)}: ${problem}`);
};

const main = async () => {
  const pages = (await listFiles(FOUNDATIONS_DIR)).filter((file) =>
    file.endsWith(`${sep}page.mdx`),
  );
  if (pages.length === 0) {
    process.stderr.write(`No page.mdx files found under ${relative(ROOT, FOUNDATIONS_DIR)}\n`);
    process.exit(1);
  }
  const itemDirs = new Set(pages.map((page) => dirname(page)));

  const errors = (await Promise.all(pages.map((page) => checkItem(page, itemDirs)))).flat();
  if (errors.length === 0) return;

  process.stderr.write(`Page dependency problems:\n${errors.map((e) => `  ${e}`).join("\n")}\n`);
  process.exit(1);
};

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`);
  process.exit(1);
});
