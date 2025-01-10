import { Node } from "unist";
import { visit } from "unist-util-visit";

// replace any text from any node that matches the regex with the new text
export const rehypeRewriteImports = () => (tree: Node) => {
  visit(tree, "text", (node: { value: string }) => {
    node.value = node.value
      // Replace @/foundations/ui with @/components
      .replace(/@\/foundations\/ui/g, "@/components")
      // Remove duplicate folder names (e.g. @/components/button/button to @/components/button)
      .replace(/\/([^/]+)\/\1/g, "/$1");
  });
};
