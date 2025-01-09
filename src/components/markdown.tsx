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

import { cn } from "@/lib/utils";

import { Button } from "@/foundations/ui/button/button";
import { SourceCode } from "@/components/source-code";
import { ComponentPreview } from "@/components/component-preview";

import { CopyButton } from "./copy-button";

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

export const Markdown = async ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const { default: MDXContent } = await evaluate(children, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeRawCode,
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
  });

  return (
    <div className={cn("markdown", className)}>
      <MDXContent components={components} />
    </div>
  );
};

export const components: ReturnType<UseMdxComponents> = {
  figure: ({ ["data-raw-code"]: rawCode, ...props }) => {
    if (rawCode) {
      return (
        <div className="relative group">
          <CopyButton
            content={rawCode}
            className="opacity-80 absolute top-2 right-2"
          />
          <figure {...props} />
        </div>
      );
    }

    return <figure {...props} />;
  },
  Button,
  SourceCode,
  ComponentPreview: (props) => (
    <div className="not-first:mt-4">
      <ComponentPreview {...props} />
    </div>
  ),
};
