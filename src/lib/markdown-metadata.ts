import { z } from "zod";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

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

export const getMetadata = async (content: string) => {
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
