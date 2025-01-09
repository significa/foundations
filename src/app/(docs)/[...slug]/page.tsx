import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { Markdown } from "@/components/markdown";
import { menu } from "../sidebar";
import { getMarkdownToc } from "@/lib/markdown-toc";
import { ComponentPreview } from "@/components/component-preview";
import { TableOfContents } from "./toc";
import { GITHUB_REPO_URL } from "@/lib/constants";
import { Pencil } from "@phosphor-icons/react/dist/ssr";

const isNotFoundError = (error: unknown): error is { code: "ENOENT" } => {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
};

const getPageContent = async (slug: string[]) => {
  try {
    return await fs.readFile(
      path.join(process.cwd(), "src", "foundations", ...slug, "page.mdx"),
      "utf-8"
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    throw error;
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const content = await getPageContent(slug);
  const toc = await getMarkdownToc(content);
  const metadata = await getMetadata(content);

  return (
    <main className="flex gap-8 md:px-4 px-2 w-full">
      <nav className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] sticky top-16 text-sm order-last w-[200px] shrink-0 pt-6">
        {toc.length > 0 && (
          <>
            <h3 className="font-medium text-foreground-secondary mb-3">
              On this page
            </h3>
            <TableOfContents headings={toc} />
            <hr className="my-6" />
          </>
        )}
        <div className="text-xs text-foreground-secondary">
          <a
            className="inline-flex items-center gap-1 font-medium"
            href={`${GITHUB_REPO_URL}/edit/next/${path.join(
              "src",
              "foundations",
              ...slug,
              "page.mdx"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Pencil /> Edit this page
          </a>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold">{metadata.title}</h1>
        {metadata.description && (
          <p className="mt-2 text-foreground-secondary">
            {metadata.description}
          </p>
        )}
        {metadata.preview && (
          <ComponentPreview className="mt-8" slug={metadata.preview} />
        )}

        <Markdown>{content}</Markdown>
      </div>
    </main>
  );
}

// Generate a page per menu item in the sidebar
export async function generateStaticParams() {
  const items = menu.flatMap((item) =>
    item.children.map((child) => ({ slug: child.href.split("/").slice(1) }))
  );

  return items;
}

// Metadata
const metadataSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string().optional(),
  preview: z.string().optional(),
  dependencies: z
    .array(
      z.object({
        title: z.string({ required_error: "Dependency title is required" }),
        href: z.string({ required_error: "Dependency href is required" }),
      })
    )
    .optional(),
});

const getMetadata = async (content: string) => {
  const { metadata } = await evaluate(content, runtime);

  if (!metadata) {
    throw new Error("Metadata is required in docs pages");
  }

  try {
    return metadataSchema.parse(metadata);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Page metadata malformed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    throw error;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const content = await getPageContent(slug);
  const metadata = await getMetadata(content);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}
