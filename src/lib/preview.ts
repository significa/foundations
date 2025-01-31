import { glob } from "glob";
import path from "path";

export const getPreviewSourcePath = async (slug: string) => {
  const [filepath] = await glob(`./src/foundations/**/${slug}.preview.tsx`);

  return filepath;
};

export const getPreviewSlugs = async () => {
  const filepaths = await glob(`./src/foundations/**/*.preview.tsx`);

  return filepaths.map((filepath) => path.basename(filepath, ".preview.tsx"));
};
