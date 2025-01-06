import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { Button } from "@/foundations/ui/button";

import { SourceCode } from "./source-code";
import { ComponentPreview } from "./component-preview";

export const MdxPage = async ({ code }: { code: string }) => {
  const { default: MDXContent } = await evaluate(code, {
    ...runtime,
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  });

  return (
    <>
      <MDXContent components={{ Button, SourceCode, ComponentPreview }} />
    </>
  );
};
