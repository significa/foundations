import { createServerFn } from "@tanstack/react-start";
import path from "path";

import {
  getMostRecentModifiedDate,
  getDirectoryFiles,
  readFile,
} from "@/server/fs";
import { getFoundationsPagePath } from "@/lib/constants";
import { getMetadata } from "@/lib/markdown-metadata";
import { getMarkdownToc } from "@/lib/markdown-toc";

import z from "zod";

export const getPageContent = createServerFn({
  type: "static",
})
  .validator(z.string())
  .handler(async (ctx) => {
    const slug = ctx.data.split("/");
    const content = await import(`../foundations/${ctx.data}/page.mdx`);
    const filePath = getFoundationsPagePath(slug);
    const toc = await getMarkdownToc(content);
    const metadata = await getMetadata(content);
    const lastModifiedAt = await getMostRecentModifiedDate(
      await getDirectoryFiles(path.dirname(filePath))
    );

    return {
      slug,
      filePath,
      content,
      toc,
      metadata,
      lastModifiedAt,
    }
  });