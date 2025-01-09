import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

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
        (node: Element & { properties: { id: string } }) => {
          if (
            node.tagName.match(/^h[1-6]$/) &&
            node.properties &&
            node.properties.id &&
            node.children?.[0] &&
            "value" in node.children[0] &&
            typeof node.children[0].value === "string"
          ) {
            headings.push({
              id: node.properties.id,
              text: node.children[0].value,
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
