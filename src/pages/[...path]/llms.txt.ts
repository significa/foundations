import { site } from "astro:config/server";
import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import z from "zod";
import { getPageVersion } from "@/lib/utils/content";
import {
  code,
  createComponentResolver,
  defineComponent,
  findUnresolvedComponents,
  link,
  markdown,
} from "@/lib/utils/markdown";

type Page = CollectionEntry<"pages">;

const SETUP_CSS_FILES = {
  prefersScheme: "src/foundations/setup/globals-prefers-schema.css",
  dataAttr: "src/foundations/setup/globals-data-attr.css",
};

const REACT_TYPES_FILE = "src/react.d.ts";

// Code spans keep generics like `RefObject<HTMLElement>` from reading as tags; pipes are escaped for GFM tables
const inlineCode = (value: string) => `\`${value.replaceAll("|", "\\|")}\``;

const resolveComponents = createComponentResolver([
  defineComponent({
    name: "Preview",
    props: z.object({
      slug: z.string(),
    }),
    parser: async ({ slug }) => {
      const preview = await getEntry("previews", slug);

      if (!preview) {
        return `**Error:** Preview with slug "${slug}" not found.`;
      }

      return code(path.join(process.cwd(), preview.data.file));
    },
  }),
  defineComponent({
    name: "SourceCode",
    props: z.object({
      file: z.string(),
    }),
    parser: ({ file }) => code(path.join(process.cwd(), file)),
  }),
  defineComponent({
    name: "SetupCssTabs",
    props: z.object({}),
    parser: async () =>
      markdown(
        "### Option A: follow the OS preference",
        "",
        "Light/dark follows `prefers-color-scheme`. No theme switcher.",
        "",
        await code(path.join(process.cwd(), SETUP_CSS_FILES.prefersScheme)),
        "",
        "### Option B: manual switcher via `data-theme`",
        "",
        'Set `data-theme="light"` or `data-theme="dark"` on `<html>` to switch themes.',
        "",
        await code(path.join(process.cwd(), SETUP_CSS_FILES.dataAttr)),
      ),
  }),
  defineComponent({
    name: "PropsTable",
    props: z.object({
      definition: z.record(
        z.string(),
        z.object({
          default: z.union([z.string(), z.boolean(), z.number()]).optional(),
          required: z.boolean().optional(),
          type: z.union([z.string(), z.array(z.string())]),
          description: z.string().optional(),
        }),
      ),
    }),
    parser: async ({ definition }) => {
      return markdown(
        "| Prop | Type | Default | Required | Description |",
        "| ---- | ---- | ------- | -------- | ----------- |",
        ...Object.entries(definition).map(([propName, propDef]) => {
          const types = Array.isArray(propDef.type) ? propDef.type : [propDef.type];
          const type = types.map(inlineCode).join(" \\| ");

          const defaultValue =
            propDef.default === undefined || propDef.default === ""
              ? "-"
              : inlineCode(String(propDef.default));
          const required = propDef.required ? "Yes" : "No";
          const description = propDef.description || "-";

          return `| ${propName} | ${type} | ${defaultValue} | ${required} | ${description} |`;
        }),
      );
    },
  }),
]);

/** Files a page renders inline through `<SourceCode>` / `<SetupCssTabs>`. */
const getInlineSourceFiles = (page: Page) => {
  const body = page.body || "";
  const files = [...body.matchAll(/<SourceCode\s[^>]*file="([^"]+)"/g)].flatMap((m) => m[1] ?? []);

  if (body.includes("<SetupCssTabs")) {
    files.push(SETUP_CSS_FILES.prefersScheme, SETUP_CSS_FILES.dataAttr);
  }

  return files;
};

type DependencyEntry = {
  href: string;
  label: string;
  names: Set<string>;
  pageId: string | null;
  direct: boolean;
};

const getInternalPageId = (href: string) => {
  if (!href.startsWith("/")) return null;
  return href.split("#")[0]?.replace(/^\/+|\/+$/g, "") ?? "";
};

/** Full dependency closure, leaves first (post-order), deduped and cycle-safe. */
const getDependencyClosure = (page: Page, pages: Page[]) => {
  const entries = new Map<string, DependencyEntry>();
  const visiting = new Set<string>([page.id]);

  const visit = (current: Page, isDirect: boolean) => {
    for (const { name, href } of current.data.dependencies ?? []) {
      const pageId = getInternalPageId(href);
      const key = pageId ?? href;
      const existing = entries.get(key);

      if (existing) {
        existing.names.add(name);
        existing.direct ||= isDirect;
        continue;
      }

      if (pageId === null) {
        entries.set(key, { href, label: name, names: new Set([name]), pageId, direct: isDirect });
        continue;
      }

      if (visiting.has(pageId)) continue;

      const dependencyPage = pages.find((p) => p.id === pageId);

      if (!dependencyPage) {
        throw new Error(
          `[llms.txt] ${page.id}: dependency "${name}" points to missing page ${href}`,
        );
      }

      visiting.add(pageId);
      visit(dependencyPage, false);
      visiting.delete(pageId);

      entries.set(key, {
        href: `/${pageId}/llms.txt`,
        label: dependencyPage.data.title,
        names: new Set([name]),
        pageId,
        direct: isDirect,
      });
    }
  };

  visit(page, true);

  return [...entries.values()];
};

const usesCssVariablesInStyle = async (files: string[]) => {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf-8")));
  return contents.some((content) => /style=\{\{[^}]*["']--/.test(content));
};

const formatDependency = (entry: DependencyEntry) => {
  const extraNames = [...entry.names].filter((name) => name !== entry.label);
  const names = extraNames.length ? ` (${extraNames.map((n) => `\`${n}\``).join(", ")})` : "";
  const kind = entry.pageId === null ? " — external" : "";
  const transitive = entry.direct ? "" : " — transitive";

  return `${link(entry.label, entry.href)}${names}${kind}${transitive}`;
};

const getDependencySection = async (page: Page, pages: Page[]) => {
  const closure = getDependencyClosure(page, pages);
  const hasSource = (page.data.files?.length ?? 0) > 0 && page.id !== "setup";

  const sourceFiles = [page, ...closure.map((e) => pages.find((p) => p.id === e.pageId))].flatMap(
    (p) => p?.data.files ?? [],
  );
  const needsReactTypes = hasSource && (await usesCssVariablesInStyle(sourceFiles));

  const items = [
    ...(hasSource
      ? [
          `${link("Setup", "/setup/llms.txt")}: global CSS tokens and \`cn\`/\`cva\` from \`@/lib/utils/classnames\``,
        ]
      : []),
    ...(needsReactTypes
      ? [`\`${REACT_TYPES_FILE}\` (below): lets \`style\` accept CSS custom properties`]
      : []),
    ...closure.map(formatDependency),
  ];

  if (items.length === 0) return [];

  return [
    "",
    "## Dependencies",
    "",
    "Copy these first, in this order (leaves first):",
    "",
    ...items.map((item, index) => `${index + 1}. ${item}`),
    ...(needsReactTypes ? ["", await code(path.join(process.cwd(), REACT_TYPES_FILE))] : []),
  ];
};

export const GET = (async ({ params }) => {
  const page = await getEntry("pages", params.path || "");

  if (!site) {
    throw new Error("Site URL is not defined");
  }

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const pages = await getCollection("pages");
  const version = await getPageVersion(page, getInlineSourceFiles(page));
  const sha = version.sha ?? "unknown";
  const versionLine = [sha, version.date].filter(Boolean).join(" · ");

  const files = page.data.files ? await Promise.all(page.data.files.map(code)) : undefined;

  const content = markdown(
    `# ${page.data.title}`,
    "",
    page.data.description,
    "",
    `Version: ${versionLine}`,
    "",
    `When copying, keep a header comment \`// Adapted from Foundations /${page.id}@${sha}\` (\`/* … */\` in CSS) so the copy can be diffed against upstream later.`,
    ...(await getDependencySection(page, pages)),
    ...(files ? ["", "## Source Code", "", ...files] : []),
    "",
    "",
    await resolveComponents(page.body || ""),
    "",
  );

  const unresolved = findUnresolvedComponents(content);

  if (unresolved.length > 0) {
    throw new Error(
      `[llms.txt] ${page.id}: unresolved MDX component(s) ${unresolved.map((n) => `<${n}>`).join(", ")}. Add a resolver in src/pages/[...path]/llms.txt.ts.`,
    );
  }

  return new Response(content);
}) satisfies APIRoute;

export async function getStaticPaths() {
  const pages = await getCollection("pages");

  return pages.map((page) => ({
    params: { path: page.id },
  }));
}
