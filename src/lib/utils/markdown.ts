import { readFile } from "node:fs/promises";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type z from "zod";
import { SITE_ORIGIN } from "@/lib/constants";

const markdown = (...lines: string[]) => {
  return lines.join("\n");
};

const link = (text: string, href: string) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const transformedHref = isInternal ? `${new URL(SITE_ORIGIN).origin}${href}` : href;

  return `[${text}](${transformedHref})`;
};

const code = async (filePath: string) => {
  const raw = await readFile(filePath, "utf-8");
  const extension = filePath.split(".").pop() || "";

  // Fence must outlast any backtick run in the file, or the block closes early
  const longestRun = Math.max(0, ...(raw.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  const body = raw.endsWith("\n") ? raw : `${raw}\n`;

  return `${fence}${extension}\n${body}${fence}`;
};

type ComponentDefinition<T extends z.ZodType> = {
  name: string;
  props: T;
  parser: (props: z.infer<T>) => string | Promise<string>;
};

const defineComponent = <T extends z.ZodType>(definition: {
  name: string;
  props: T;
  parser: (props: z.infer<T>) => Promise<string> | string;
}): ComponentDefinition<T> => {
  return definition as ComponentDefinition<T>;
};

type AstNode = { type: string; name?: string | null; children?: AstNode[] };

const createComponentResolver = (components: ComponentDefinition<z.ZodType>[]) => {
  return async (mdxContent: string, label: string) => {
    const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

    // Only top-level elements get replaced, so a known component nested elsewhere is unresolved too
    const unresolved = new Set<string>();
    const findUnresolved = (node: AstNode, isTopLevel: boolean) => {
      const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

      if (isJsx && node.name && /^[A-Z]/.test(node.name)) {
        const isResolved =
          isTopLevel &&
          node.type === "mdxJsxFlowElement" &&
          components.some((c) => c.name === node.name);
        if (!isResolved) unresolved.add(node.name);
      }

      for (const child of node.children ?? []) findUnresolved(child, false);
    };

    for (const node of tree.children) findUnresolved(node, true);

    if (unresolved.size > 0) {
      const names = [...unresolved].map((name) => `<${name}>`).join(", ");
      throw new Error(
        `[llms.txt] ${label}: unresolved MDX component(s) ${names}. Add a resolver in src/pages/[...path]/llms.txt.ts.`,
      );
    }

    const replacements: { start: number; end: number; value: string }[] = [];

    for (const node of tree.children) {
      const isEsm = node.type === "mdxjsEsm";
      const isComponent =
        node.type === "mdxJsxFlowElement" && !!node.name && /^[A-Z]/.test(node.name);

      if (!isEsm && !isComponent) continue;

      const start = node.position?.start.offset;
      const end = node.position?.end.offset;

      if (start === undefined || end === undefined) {
        throw new Error(`Node position is missing for ${node.type} node`);
      }

      // MDX `import`/`export` lines mean nothing to a reader
      if (node.type === "mdxjsEsm") {
        replacements.push({ start, end, value: "" });
        continue;
      }

      if (node.type !== "mdxJsxFlowElement") continue;

      const componentDef = components.find((c) => c.name === node.name);
      if (!componentDef) continue;

      const rawProps = Object.fromEntries(
        node.attributes.map((attr) => {
          if (attr.type === "mdxJsxAttribute") {
            return [
              attr.name,
              !attr.value
                ? true
                : typeof attr.value === "object"
                  ? new Function(`return ${attr.value.value}`)()
                  : attr.value,
            ];
          }

          return [];
        }),
      );

      const props = componentDef.props.safeParse(rawProps);

      if (!props.success) {
        throw new Error(
          `Invalid props for component ${componentDef.name}: ${props.error}.\nReceived: ${JSON.stringify(rawProps)}`,
        );
      }

      replacements.push({ start, end, value: await componentDef.parser(props.data) });
    }

    let transformedMdx = mdxContent;

    // Back to front so earlier offsets stay valid
    for (const { start, end, value } of replacements.reverse()) {
      transformedMdx = transformedMdx.slice(0, start) + value + transformedMdx.slice(end);
    }

    return transformedMdx.trim();
  };
};

export { code, createComponentResolver, defineComponent, link, markdown };
