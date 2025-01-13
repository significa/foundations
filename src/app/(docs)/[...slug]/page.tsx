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
    <main className="w-full gap-8 px-2 md:px-4 lg:flex">
      <nav className="sticky top-16 order-last hidden h-[calc(100dvh-var(--spacing)*14)] w-[200px] shrink-0 overflow-y-auto pt-6 text-sm lg:block">
        {toc.length > 0 && (
          <>
            <h3 className="text-foreground-secondary mb-3 font-medium">
              On this page
            </h3>
            <TableOfContents headings={toc} />
            <hr className="my-6" />
          </>
        )}
        <div className="text-foreground-secondary text-xs">
          <a
            className="hover:text-foreground mb-2 inline-flex items-center gap-1 font-medium transition"
            href={`${GITHUB_REPO_URL}/edit/next/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Pencil /> Edit this page
          </a>
          <LastUpdated filePath={filePath} />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl flex-1 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          {metadata.description && (
            <p className="text-foreground-secondary mt-2">
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
