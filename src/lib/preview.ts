import path from "path";
import { walkDirectory } from "./fs";

export const getPreviewSourcePath = async (slug: string) => {
  for await (const filepath of walkDirectory("./src/foundations")) {
    if (filepath.endsWith(`${slug}.preview.tsx`)) {
      return filepath;
    }
  }
  return undefined;
};

export const getPreviewSlugs = async () => {
  const filepaths = [];

  for await (const filepath of walkDirectory("./src/foundations")) {
    if (filepath.endsWith(".preview.tsx")) {
      filepaths.push(filepath);
    }
  }

  return filepaths.map((filepath) => path.basename(filepath, ".preview.tsx"));
};
