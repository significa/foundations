import { z } from "zod";

// Metadata
const metadataSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string().optional(),
  preview: z
    .union([
      z.string(),
      z.object({
        slug: z.string(),
        mode: z.enum(["inline", "iframe"]).optional(),
        layout: z.enum(["centered", "padded", "fullscreen"]).optional(),
      }),
    ])
    .optional(),
  files: z.array(z.string()).optional(),
  dependencies: z
    .array(
      z.object({
        name: z.string({ required_error: "Dependency name is required" }),
        href: z.string({ required_error: "Dependency href is required" }),
      })
    )
    .optional(),
});

export const getMetadata = async (content: string) => {
  const fragment = content.match(
    /export\s+const\s+metadata\s*=\s*{[\s\S]*?}\s*;/
  )?.[0];

  if (!fragment) {
    throw new Error(
      "Could not find metadata export in docs page. Expected 'export const metadata = {...};'"
    );
  }

  let metadata;
  try {
    metadata = Function(
      `"use strict"; ${fragment.replace("export", "")}; return metadata`
    )();
  } catch (error) {
    throw new Error(
      `Failed to evaluate metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error }
    );
  }

  if (!metadata || typeof metadata !== "object") {
    const type = metadata === null ? "null" : typeof metadata;

    throw new Error(
      `Invalid metadata format. Expected metadata to be an object, got: ${type}`
    );
  }

  try {
    return metadataSchema.parse(metadata);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Page metadata malformed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
        { cause: error }
      );
    }

    throw error;
  }
};
