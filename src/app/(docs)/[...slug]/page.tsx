import path from "path";

import { notFound } from "next/navigation";
import { Pencil } from "@phosphor-icons/react/dist/ssr";

import { readFile } from "@/lib/fs";
import { getFoundationsPagePath, GITHUB_REPO_URL } from "@/lib/constants";
import { getMetadata } from "@/lib/markdown-metadata";
import { getMarkdownToc } from "@/lib/markdown-toc";
import { navigation } from "@/lib/navigation";

import { Preview } from "@/components/preview";
import { Markdown } from "@/components/markdown";

import { TableOfContents } from "./toc";
import { LastUpdated } from "./last-updated";
import { Navigation } from "./navigation";

const isNotFoundError = (error: unknown): error is { code: "ENOENT" } => {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
};

const getPageContent = async (filePath: string) => {
  try {
    return await readFile(path.join(process.cwd(), filePath));
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

  const filePath = getFoundationsPagePath(slug);
  const content = await getPageContent(filePath);
  const toc = await getMarkdownToc(content);
  const metadata = await getMetadata(content);

  return (
    <main className="gap-8 md:px-4 px-2 w-full lg:flex">
      <nav className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] sticky top-16 text-sm order-last w-[200px] shrink-0 pt-6 hidden lg:block">
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
            className="inline-flex items-center gap-1 font-medium mb-2 hover:text-foreground transition"
            href={`${GITHUB_REPO_URL}/edit/next/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Pencil /> Edit this page
          </a>
          <LastUpdated filePath={filePath} />
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          {metadata.description && (
            <p className="mt-2 text-foreground-secondary">
              {metadata.description}
            </p>
          )}
        </div>
        {metadata.preview && (
          <Preview
            className="mb-8"
            slug={metadata.preview}
            withSource={false}
          />
        )}

        <div className="pb-40">
          <Markdown>{content}</Markdown>
        </div>

        <Navigation slug={slug} />
      </div>
    </main>
  );
}

// Generate a page per menu item in the sidebar
export async function generateStaticParams() {
  const items = navigation.flatMap((item) =>
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

  const content = await getPageContent(getFoundationsPagePath(slug));
  const metadata = await getMetadata(content);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}
