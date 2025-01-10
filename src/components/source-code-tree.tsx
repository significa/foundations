import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

import { readFile } from "@/lib/fs";

import { SourceCodeTreeClient } from "./source-code-tree-client";

type Items = React.ComponentProps<typeof SourceCodeTreeClient>["items"];

// TODO: this is not a great idea and it's duplicating what we're doing in markdown.tsx
// we should probably figure out a way to contralize and improve all of this
async function highlightCode(code: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      keepBackground: false,
      theme: {
        dark: "github-dark-default",
        light: "kanagawa-lotus",
      },
    })
    .use(rehypeStringify)
    .process(code);

  return String(file);
}

const addCodeToItems = async (items: Items): Promise<Items> => {
  return await Promise.all(
    items.map(async (item) => {
      if ("children" in item) {
        return { ...item, children: await addCodeToItems(item.children) };
      }

      const code = await readFile(path.join(process.cwd(), "src", item.path));
      const language = path.extname(item.path).slice(1);

      return {
        ...item,
        code: await highlightCode(`\`\`\`${language}\n${code}\`\`\``),
        language,
      };
    })
  );
};

export const SourceCodeTree = async ({ items }: { items: Items }) => {
  return <SourceCodeTreeClient items={await addCodeToItems(items)} />;
};
