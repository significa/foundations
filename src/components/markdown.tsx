import "./markdown.css";

import * as runtime from "react/jsx-runtime";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";

import { Node } from "unist";
import { visit } from "unist-util-visit";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, {
  Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";

import { Button } from "@/foundations/ui/button/button";
import { SourceCode } from "@/components/source-code";
import { ComponentPreview } from "@/components/component-preview";

const rehypeRawCode = () => (tree: Node) => {
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

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-default",
    light: "kanagawa-lotus",
  },
  keepBackground: false,
  defaultLang: {
    block: "js",
    inline: "text",
  },
};

export const Markdown = async ({ children }: { children: string }) => {
  const { default: MDXContent } = await evaluate(children, {
    ...runtime,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeRawCode,
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
    remarkPlugins: [remarkGfm],
  });

  return (
    <div className="markdown">
      <MDXContent components={components} />
    </div>
  );
};

export const components: ReturnType<UseMdxComponents> = {
  Button,
  SourceCode,
  ComponentPreview: (props) => (
    <div className="mt-4">
      <ComponentPreview {...props} />
    </div>
  ),
};
