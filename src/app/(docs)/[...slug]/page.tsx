import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { Markdown } from "@/components/markdown";
import { menu } from "../sidebar";

const getPageContent = async (slug: string[]) => {
  return await fs.readFile(
    path.join(process.cwd(), "src", "foundations", ...slug, "page.mdx"),
    "utf-8"
  );
};

export async function generateStaticParams() {
  const items = menu.flatMap((item) =>
    item.children.map((child) => ({ slug: child.href.split("/").slice(1) }))
  );

  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  try {
    const { metadata } = await evaluate(await getPageContent(slug), runtime);

    const parsed = z
      .object({
        title: z.string(),
        description: z.string().optional(),
      })
      .parse(metadata);

    return {
      title: parsed.title,
      description: parsed.description,
    };
  } catch (_error) {
    // noop
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  try {
    return <Markdown>{await getPageContent(slug)}</Markdown>;
  } catch (_error) {
    notFound();
  }
}
