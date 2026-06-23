import type { KnipConfig } from "knip";

// `page.mdx` docs reference real component/util source two ways that knip can't
// see: a `files:` list in the YAML frontmatter and `<SourceCode file=… />`
// elements. This compiler surfaces both as imports (rewriting `src/` to the
// `@/` alias) so knip resolves the doc-driven usage instead of reporting the
// whole library as dead. Body `import` statements are intentionally NOT parsed:
// the guides embed illustrative imports inside code fences (@playwright/test,
// next, …) that would register as false dependencies.
const mdxCompiler = (text: string): string => {
  const paths: string[] = [];

  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1];
  const filesBlock = frontmatter?.match(/^files:\n((?:\s*-\s*.+\n?)+)/m)?.[1];
  if (filesBlock) {
    for (const [, path] of filesBlock.matchAll(/-\s*(\S+)/g)) {
      if (path) paths.push(path);
    }
  }

  for (const [, path] of text.matchAll(/<SourceCode\s+file="([^"]+)"/g)) {
    if (path) paths.push(path);
  }

  return paths.map((path) => `import "${path.replace(/^src\//, "@/")}";`).join("\n");
};

const config: KnipConfig = {
  entry: [
    "src/pages/**/*.astro",
    "src/**/*.preview.tsx",
    "src/**/page.mdx",
    // Imported in the setup page's MDX body; pulls in its .tsx island too.
    "src/components/setup-css-tabs.astro",
    "astro.config.*",
    "scripts/*.mjs",
  ],
  project: ["src/**/*.{ts,tsx,astro}"],
  compilers: {
    mdx: mdxCompiler,
  },
  // Generated at build time by Pagefind; not present in the source tree.
  ignoreUnresolved: ["/pagefind/pagefind.js"],
  // Foundations is a copy-paste library: exported components, prop types, and
  // context hooks are the public surface, so unused-export/type reports are
  // noise here. Keep the high-signal checks (unused files, dependencies).
  rules: {
    exports: "off",
    types: "off",
    nsExports: "off",
    nsTypes: "off",
    enumMembers: "off",
  },
};

export default config;
