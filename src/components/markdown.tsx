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
import { DependenciesList } from "@/components/dependencies-list";
import {
  FileTree,
  FileTreeNavigation,
  FileTreeFolder,
  FileTreeFile,
  FileTreeContent,
} from "@/components/file-tree";

import { CopyButton } from "./copy-button";

export const Markdown = async ({ children }: { children: string }) => {
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
    <div className="[&_&>div]:my-0 [&>div]:my-4">
      <MDXContent components={components} />
    </div>
  );
};

const Heading = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "scroll-margin-top-20 mt-[2em] mb-[1em] font-semibold tracking-tight [&_a]:no-underline",
      className
    )}
    {...props}
  />
);

export const components: ReturnType<UseMdxComponents> = {
  h1: (props) => <Heading className="text-3xl" {...props} />,
  h2: (props) => <Heading className="text-2xl" {...props} />,
  h3: (props) => <Heading className="text-xl" {...props} />,
  h4: (props) => <Heading className="text-lg" {...props} />,
  h5: (props) => <Heading className="text-md" {...props} />,
  h6: (props) => <Heading className="text-sm" {...props} />,
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
      className="my-4 h-auto max-w-full rounded-xl"
      alt={props.alt}
      {...props}
    />
  ),
  hr: () => <hr className="my-8" />,
  table: (props) => <table className="w-full overflow-y-auto" {...props} />,
  tr: (props) => <tr className="border-border border-b" {...props} />,
  th: (props) => (
    <th className="py-2 text-left text-sm font-semibold" {...props} />
  ),
  td: (props) => <td className="py-2 text-left text-sm" {...props} />,
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
  DependenciesList,
  Tabs,
  TabsItems,
  TabsItem,
  TabsPanels,
  TabsPanel,
  FileTree,
  FileTreeNavigation,
  FileTreeFolder,
  FileTreeFile,
  FileTreeContent,
};
