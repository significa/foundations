import "./markdown.css";

import * as runtime from "react/jsx-runtime";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import { cn } from "@/lib/utils";
import { rehypeRewriteImports } from "@/lib/rehype-rewrite-imports";
import { rehypePrettyCodeOptions } from "@/lib/rehype-pretty-code";
import { rehypeRawCode } from "@/lib/rehype-raw-code";

import { Button } from "@/foundations/ui/button/button";
import {
  Tabs,
  TabsItems,
  TabsItem,
  TabsPanels,
  TabsPanel,
} from "@/foundations/ui/tabs/tabs";

import { SourceCode } from "@/components/source-code";
import { Preview } from "@/components/preview";
import { FileTree, FileTreeFolder, FileTreeFile } from "@/components/file-tree";
import { PropsTable } from "@/components/props-table";

import { CopyButton } from "./copy-button";

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
      rehypeRewriteImports,
      rehypeRawCode,
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
  });

  return (
    <div
      className={cn("[&_&>div]:my-0 [&>div:not(:first-child)]:my-6", className)}
    >
      <MDXContent components={components} />
    </div>
  );
};

const Heading = ({
  heading: Component = "h1",
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  heading?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => (
  <Component
    className={cn(
      "scroll-margin-top-20 mt-[2em] mb-[1em] font-semibold tracking-tight [&_a]:no-underline",
      className
    )}
    {...props}
  />
);

export const components: ReturnType<UseMdxComponents> = {
  h1: (props) => <Heading heading="h1" className="text-3xl" {...props} />,
  h2: (props) => (
    <Heading heading="h2" className="border-b pb-4 text-2xl" {...props} />
  ),
  h3: (props) => <Heading heading="h3" className="text-xl" {...props} />,
  h4: (props) => <Heading heading="h4" className="text-lg" {...props} />,
  h5: (props) => <Heading heading="h5" className="text-md" {...props} />,
  h6: (props) => <Heading heading="h6" className="text-sm" {...props} />,
  p: (props) => <p className="leading-relaxed not-first:mt-2" {...props} />,
  a: (props) => <a className="underline" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal" {...props} />,
  li: (props) => <li className="mt-2" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="bg-foreground/4 border-foreground/8 my-6 border-l-4 px-4 py-2"
      {...props}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="my-6 h-auto max-w-full rounded-xl"
      alt={props.alt}
      {...props}
    />
  ),
  hr: () => <hr className="my-8" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-b-0">
      <table className="w-full" {...props} />
    </div>
  ),
  tr: (props) => <tr className="border-border m-0 border-b" {...props} />,
  th: (props) => (
    <th className="px-4 py-2 text-left font-semibold" {...props} />
  ),
  td: (props) => <td className="px-4 py-2 text-left" {...props} />,
  figure: ({ ["data-raw-code"]: rawCode, ...props }) => {
    if (rawCode) {
      return (
        <div data-code-block className="relative">
          <CopyButton
            content={rawCode}
            className="absolute top-2 right-2 opacity-80"
          />
          <figure {...props} />
        </div>
      );
    }

    return <figure {...props} />;
  },
  Markdown,
  Button,
  SourceCode,
  Preview,
  Tabs,
  TabsItems,
  TabsItem,
  TabsPanels,
  TabsPanel,
  FileTree,
  FileTreeFolder,
  FileTreeFile,
  PropsTable,
};
