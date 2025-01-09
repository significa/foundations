import "./markdown.css";

import * as runtime from "react/jsx-runtime";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import { cn } from "@/lib/utils";

import { Button } from "@/foundations/ui/button/button";
import { SourceCode } from "@/components/source-code";
import { ComponentPreview } from "@/components/component-preview";

export const Markdown = async ({ children }: { children: string }) => {
  const { default: MDXContent } = await evaluate(children, {
    ...runtime,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [
        rehypePrettyCode,
        {
          theme: "github-dark-default",
          keepBackground: false,
        },
      ],
    ],
    remarkPlugins: [remarkGfm],
  });

  return <MDXContent components={components} />;
};

export const components: ReturnType<UseMdxComponents> = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-8 scroll-m-20 text-3xl font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 text-2xl font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-10 scroll-m-20 text-xl font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight [&>a]:no-underline",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className={cn("underline", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("text-base leading-7 not-first:mt-4", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-foreground/10 p-4 bg-foreground/5 rounded-md",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-xl", className)} alt={alt} {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8 border-border" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm",
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-b", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className={cn("py-2 text-left font-bold", className)} {...props} />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn("py-2 text-left", className)} {...props} />
  ),
  // pre: (props) => {
  //   return (
  //     <pre
  //       className="border border-border rounded-xl p-4 overflow-scroll"
  //       {...props}
  //     />
  //   );
  // },
  // code: (props) => {
  //   return <code className="text-sm" {...props} />;
  // },
  // figure: (props) => {
  //   if ("data-rehype-pretty-code-figure" in props) {
  //     return <Code code={`"Hello world"`} language="js" />;
  //   }

  //   return <figure className="mt-4" {...props} />;
  // },
  Button,
  SourceCode: (props) => (
    <div className="mt-4">
      <SourceCode {...props} />
    </div>
  ),
  ComponentPreview: (props) => (
    <div className="mt-4">
      <ComponentPreview {...props} />
    </div>
  ),
};
