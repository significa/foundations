import { createFileRoute, notFound } from "@tanstack/react-router";
import { format } from "date-fns";

import { CalendarIcon, PencilIcon } from "@phosphor-icons/react/dist/ssr";

import { GITHUB_REPO_URL } from "@/lib/constants";

import { Preview } from "@/components/preview";
import { Markdown, Heading } from "@/components/markdown";

import { TableOfContents } from "@/components/toc";
import { ArticleNavigation } from "@/components/article-navigation";
import { DependenciesList } from "@/components/dependencies-list";
import { SourceCode } from "@/components/source-code";
import { getPageContent } from "@/server/content";

const isNotFoundError = (error: unknown): error is { code: "ENOENT" } => {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
};

export const Route = createFileRoute("/(docs)/$")({
  component: RouteComponent,
  loader: async ({ params: { _splat = "" } }) => {
    try {
      return await getPageContent({ data: _splat });
    } catch (error) {
      console.log("Error loading page:", error);
      if (isNotFoundError(error)) {
        throw notFound();
      }
      throw error;
    }
  },
});

function RouteComponent() {
  const { content, metadata, toc, lastModifiedAt, filePath, slug } = Route.useLoaderData();

  return (
    <>
      <nav className="sticky top-14 order-last hidden h-[calc(100dvh-var(--spacing)*14)] w-[200px] shrink-0 overflow-y-auto pt-6 text-sm lg:block">
        {(toc.length > 0 ||
          (metadata.dependencies && metadata.dependencies.length > 0) ||
          (metadata.files && metadata.files.length > 0)) && (
          <>
            <h3 className="text-muted-foreground mb-3 font-medium">
              On this page
            </h3>
            <TableOfContents
              headings={[
                ...(metadata.dependencies
                  ? [
                      {
                        text: "Dependencies",
                        id: "dependencies",
                        level: 1,
                      },
                    ]
                  : []),
                ...(metadata.files
                  ? [
                      {
                        text: "Source Code",
                        id: "source-code",
                        level: 1,
                      },
                    ]
                  : []),
                ...toc,
              ]}
            />
            <hr className="my-6" />
          </>
        )}
        <div className="text-muted-foreground text-xs">
          <a
            className="hover:text-foreground mb-2 inline-flex items-center gap-1 font-medium transition"
            href={`${GITHUB_REPO_URL}/edit/main/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PencilIcon /> Edit this page
          </a>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <CalendarIcon />
            Edited {format(lastModifiedAt, "PPP")}
          </p>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl flex-1 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          {metadata.description && (
            <p className="text-muted-foreground mt-2">{metadata.description}</p>
          )}
        </div>
        {metadata.preview && (
          <Preview
            className="mb-8"
            slug={
              typeof metadata.preview === "string"
                ? metadata.preview
                : metadata.preview.slug
            }
            mode={
              typeof metadata.preview === "string"
                ? undefined
                : metadata.preview.mode
            }
            layout={
              typeof metadata.preview === "string"
                ? undefined
                : metadata.preview.layout
            }
          />
        )}

        {metadata.dependencies && metadata.dependencies.length > 0 && (
          <>
            <Heading heading="h2" id="dependencies">
              <a href="#dependencies">Dependencies</a>
            </Heading>
            <DependenciesList dependencies={metadata.dependencies} />
          </>
        )}

        {metadata.files && metadata.files.length > 0 && (
          <>
            <Heading heading="h2" className="[&>h2]:mb-0" id="source-code">
              <a href="#source-code">Source Code</a>
            </Heading>
            {metadata.files.map((file) => (
              <SourceCode
                key={file}
                className="mt-6"
                file={file}
                withTitle={metadata.files && metadata.files.length > 1}
                expandable
              />
            ))}
          </>
        )}

        <div className="pb-40">
          <Markdown>{content}</Markdown>
        </div>

        <ArticleNavigation slug={slug} />
      </div>
    </>
  );
}
