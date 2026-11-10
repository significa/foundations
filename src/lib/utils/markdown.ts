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

/** Capitalised JSX names the resolver won't replace; only top-level flow elements get replaced. */
const findUnresolvedComponents = (root: AstNode, knownNames: string[]) => {
  const unresolved = new Set<string>();

  const visit = (node: AstNode, isTopLevel: boolean) => {
    const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
    const isComponent = isJsx && !!node.name && /^[A-Z]/.test(node.name);
    const isResolved =
      isTopLevel && node.type === "mdxJsxFlowElement" && knownNames.includes(node.name ?? "");

    if (isComponent && !isResolved && node.name) unresolved.add(node.name);

    for (const child of node.children ?? []) visit(child, false);
  };

  for (const child of root.children ?? []) visit(child, true);

  return [...unresolved];
};

type JsxAttribute = { type: string; name?: string; value?: string | { value: string } | null };

const getRawProps = (attributes: JsxAttribute[]) => {
  return Object.fromEntries(
    attributes.map((attr) => {
      if (attr.type !== "mdxJsxAttribute") return [];
      if (!attr.value) return [attr.name, true];
      if (typeof attr.value === "object") {
        return [attr.name, new Function(`return ${attr.value.value}`)()];
      }

      return [attr.name, attr.value];
    }),
  );
};

type PositionedNode = {
  type: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
};

const getRange = (node: PositionedNode) => {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;

  if (start === undefined || end === undefined) {
    throw new Error(`Node position is missing for ${node.type} node`);
  }

  return { start, end };
};

const createComponentResolver = (components: ComponentDefinition<z.ZodType>[]) => {
  return async (mdxContent: string, label: string) => {
    const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

    const unresolved = findUnresolvedComponents(
      tree,
      components.map((c) => c.name),
    );

    if (unresolved.length > 0) {
      const names = unresolved.map((name) => `<${name}>`).join(", ");
      throw new Error(
        `[llms.txt] ${label}: unresolved MDX component(s) ${names}. Add a resolver in src/pages/[...path]/llms.txt.ts.`,
      );
    }

    const replacements: { start: number; end: number; value: string }[] = [];

    for (const node of tree.children) {
      // MDX `import`/`export` lines mean nothing to a reader
      if (node.type === "mdxjsEsm") {
        replacements.push({ ...getRange(node), value: "" });
        continue;
      }

      if (node.type !== "mdxJsxFlowElement") continue;

      const componentDef = components.find((c) => c.name === node.name);
      if (!componentDef) continue;

      const { start, end } = getRange(node);
      const rawProps = getRawProps(node.attributes);
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
