import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { Node } from "unist";
import { visit } from "unist-util-visit";

const extractText = (node: Element & Node): string => {
  if (
    node.type === "text" &&
    "value" in node &&
    typeof node.value === "string"
  ) {
    return node.value;
  }

  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }

  return "";
};

export async function getMarkdownToc(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = [];

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(() => (tree) => {
      visit(
        tree,
        "element",
        (node: Element & Node & { properties: { id: string } }) => {
          if (
            node.tagName.match(/^h[1-6]$/) &&
            node.properties &&
            node.properties.id
          ) {
            const text = extractText(node);

            headings.push({
              id: node.properties.id,
              text: text,
              level: Number(node.tagName.slice(1)),
            });
          }
        }
      );
    })
    .use(rehypeStringify)
    .process(markdown);

  return headings;
}
