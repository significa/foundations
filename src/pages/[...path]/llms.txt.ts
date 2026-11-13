import { site } from "astro:config/server";
import type { CollectionEntry } from "astro:content";
import { getCollection, getEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import z from "zod";
import { STYLES, styleCss } from "#/components/ds-config/styles.ts";
import { getPageVersion } from "#/lib/utils/content.ts";
import type { MdxTree } from "#/lib/utils/markdown.ts";
import {
  code,
  createComponentResolver,
  defineComponent,
  findComponentProps,
  link,
  markdown,
  parseMdx,
} from "#/lib/utils/markdown.ts";

type Page = CollectionEntry<"pages">;

const SETUP_CSS_FILES = {
  prefersScheme: "src/foundations/setup/globals-prefers-schema.css",
  dataAttr: "src/foundations/setup/globals-data-attr.css",
};

const REACT_TYPES_FILE = "src/react.d.ts";

const STYLES_FILE = "src/components/ds-config/styles.ts";

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
    name: "StyleRecipes",
    props: z.object({}),
    parser: () =>
      markdown(
        ...STYLES.filter((style) => Object.keys(style.tokens).length > 0).flatMap((style) => [
          `**${style.label}:** ${style.description}`,
          "",
          `\`\`\`css\n${styleCss(style)}\n\`\`\``,
          "",
        ]),
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

const stringProp = (props: Record<string, unknown>, key: string) => {
  const value = props[key];
  return typeof value === "string" ? [value] : [];
};

/** Repo-relative sources of the page's `<Preview>` examples. */
const getPreviewFiles = async (tree: MdxTree) => {
  const previewSlugs = findComponentProps(tree, "Preview").flatMap((p) => stringProp(p, "slug"));
  const previews = await Promise.all(previewSlugs.map((slug) => getEntry("previews", slug)));
  // Preview paths are stored with a leading slash
  return previews.flatMap((preview) => (preview ? [preview.data.file.replace(/^\/+/, "")] : []));
};

/**
 * Every source file a page emits as code (repo-relative): `files`, `<SourceCode>`,
 * `<SetupCssTabs>`, `<StyleRecipes>` and `<Preview>` sources.
 */
const getEmittedSourceFiles = (page: Page, tree: MdxTree, previewFiles: string[]) => {
  const sourceCodeFiles = findComponentProps(tree, "SourceCode").flatMap((p) =>
    stringProp(p, "file"),
  );
  const setupCssFiles =
    findComponentProps(tree, "SetupCssTabs").length > 0
      ? [SETUP_CSS_FILES.prefersScheme, SETUP_CSS_FILES.dataAttr]
      : [];

  const styleFiles = findComponentProps(tree, "StyleRecipes").length > 0 ? [STYLES_FILE] : [];

  return [
    ...(page.data.files ?? []),
    ...sourceCodeFiles,
    ...setupCssFiles,
    ...styleFiles,
    ...previewFiles,
  ];
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

const someFileMatches = async (files: string[], pattern: RegExp) => {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf-8")));
  return contents.some((content) => pattern.test(content));
};

const formatDependency = (entry: DependencyEntry) => {
  const extraNames = [...entry.names].filter((name) => name !== entry.label);
  const names = extraNames.length ? ` (${extraNames.map((n) => `\`${n}\``).join(", ")})` : "";
  const kind = entry.pageId === null ? " — external" : "";
  const transitive = entry.direct ? "" : " — transitive";

  return `${link(entry.label, entry.href)}${names}${kind}${transitive}`;
};

const getDependencySection = async (
  pages: Page[],
  closure: DependencyEntry[],
  emittedFiles: string[],
) => {
  // Closure files count too: copying a dependency drags in what it imports
  const sourceFiles = [
    ...emittedFiles,
    ...closure.flatMap((e) => pages.find((p) => p.id === e.pageId)?.data.files ?? []),
  ];
  const needsSetup = await someFileMatches(sourceFiles, /from ["']#\/lib\//);
  const needsReactTypes = await someFileMatches(sourceFiles, /style=\{\{[^}]*["']--/);

  const items = [
    ...(needsSetup
      ? [
          `${link("Setup", "/setup/llms.txt")}: global CSS tokens and \`cn\`/\`cva\` from \`#/lib/utils/classnames.ts\``,
        ]
      : []),
    ...(needsReactTypes
      ? [`\`${REACT_TYPES_FILE}\` (below): lets \`style\` accept CSS custom properties`]
      : []),
    ...closure.map(formatDependency),
  ];

  if (items.length === 0) return [];

  return [
    markdown(
      "## Dependencies",
      "",
      "Copy these first, in this order (leaves first):",
      "",
      ...items.map((item, index) => `${index + 1}. ${item}`),
      ...(needsReactTypes ? ["", await code(path.join(process.cwd(), REACT_TYPES_FILE))] : []),
    ),
  ];
};

const FOUNDATIONS_IMPORT = /from\s+["']#\/foundations\/([^"']+)["']/g;

/** Items the examples import that the page's own dependency closure doesn't bring in. */
const getExamplesAlsoUse = async (
  page: Page,
  pages: Page[],
  closure: DependencyEntry[],
  previewFiles: string[],
) => {
  const covered = new Set([page.id, ...closure.map((e) => e.pageId)]);
  const contents = await Promise.all(previewFiles.map((file) => readFile(file, "utf-8")));
  const used = new Map<string, Page>();

  for (const content of contents) {
    for (const [, target = ""] of content.matchAll(FOUNDATIONS_IMPORT)) {
      // Longest matching id wins, so a nested page isn't attributed to its parent
      const owner = pages
        .filter((p) => target.startsWith(`${p.id}/`))
        .sort((a, b) => b.id.length - a.id.length)[0];
      if (owner && !covered.has(owner.id)) used.set(owner.id, owner);
    }
  }

  if (used.size === 0) return "";

  const links = [...used.values()].map((p) => link(p.data.title, `/${p.id}/llms.txt`));
  return `Examples also use: ${links.join(", ")} (not needed to use ${page.data.title} itself).`;
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
  // One parse feeds the source-file list, the unresolved-tag check and the resolver
  const body = page.body || "";
  const tree = parseMdx(body);
  const previewFiles = await getPreviewFiles(tree);
  const emittedFiles = getEmittedSourceFiles(page, tree, previewFiles);
  const closure = getDependencyClosure(page, pages);
  const version = await getPageVersion(page, emittedFiles);
  const sha = version.sha ?? "unknown";
  const versionLine = [sha, version.date?.slice(0, 10)].filter(Boolean).join(" · ");

  const files = page.data.files ? await Promise.all(page.data.files.map(code)) : [];
  const hasSource = emittedFiles.length > 0;

  const sections = [
    `# ${page.data.title}`,
    page.data.description,
    `Version: ${versionLine}`,
    hasSource
      ? `When copying, keep a header comment \`// Adapted from Foundations /${page.id}@${sha}\` (\`/* … */\` in CSS) so the copy can be diffed against upstream later. Imports use the \`#/\` alias with file extensions (\`#/foundations/<category>/<name>/<name>.tsx\`); rewrite them to your project's layout, keeping the extensions.`
      : "",
    ...(await getDependencySection(pages, closure, emittedFiles)),
    await getExamplesAlsoUse(page, pages, closure, previewFiles),
    files.length > 0 ? markdown("## Source Code", "", files.join("\n\n")) : "",
    await resolveComponents(tree, body, page.id),
  ];

  const content = `${sections.filter(Boolean).join("\n\n")}\n`;

  return new Response(content);
}) satisfies APIRoute;

export async function getStaticPaths() {
  const pages = await getCollection("pages");

  return pages.map((page) => ({
    params: { path: page.id },
  }));
}
