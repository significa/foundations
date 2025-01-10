import { Node } from "unist";
import { visit } from "unist-util-visit";

export const rehypeRawCode = () => (tree: Node) => {
  visit(
    tree,
    "element",
    function (node: Element & { properties: { ["data-raw-code"]?: string } }) {
      if (node.tagName === "pre" && node.children) {
        const [codeEl] = node.children;

        if (codeEl.tagName !== "code") return;

        const firstChild = codeEl.children?.[0];

        if (
          firstChild &&
          "value" in firstChild &&
          typeof firstChild.value === "string"
        ) {
          node.properties["data-raw-code"] = firstChild.value;
        }
      }
    }
  );
};
