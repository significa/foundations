import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { link, markdown } from "@/lib/utils/markdown";
import { getNavigationItems } from "@/lib/utils/navigation";

export const GET: APIRoute = async () => {
  const pages = await getCollection("pages");
  const items = await getNavigationItems(pages);

  return new Response(
    markdown(
      "# Significa Foundations",
      "",
      "> Foundations is an opinionated collection of components, patterns, and guidelines for building modern digital products.",
      "",
      "Foundations is a React 19 + TypeScript + Tailwind CSS v4 library of UI primitives, hooks and utilities. Components are copied into your project and adapted to it, not installed as a package.",
      "",
      "How to use these docs:",
      "",
      `1. Fetch ${link("/setup/llms.txt", "/setup/llms.txt")} first: global CSS and the \`cn\`/\`cva\` helpers every component needs.`,
      "2. Each page lists its dependencies, including transitive ones, in the order to copy them (leaves first).",
      "3. Each page has a version stamp. Keep the provenance comment it asks for (`// Adapted from Foundations <path>@<sha>`) at the top of every copied file.",
      "",
      markdown(
        ...items.map((item) => {
          return markdown(
            `## ${item.title.charAt(0).toUpperCase()}${item.title.slice(1)}`,
            "",
            markdown(
              ...item.children.map((child) => {
                const description = pages.find((page) => page.id === child.id)?.data.description;

                return `- ${link(child.title, `${child.href}/llms.txt`)}: ${description || ""}`;
              }),
            ),
            "",
          );
        }),
        "",
      ),
    ),
  );
};
