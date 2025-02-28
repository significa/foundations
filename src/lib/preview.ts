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

// FUTURE: We could use the webpack require.context API to get all the preview files,
// but at the moment, it's not 1-1 compatible with turbopack
// https://webpack.js.org/api/module-methods/#requirecontext
//
// example:
// require.context("../foundations/", true, /\.preview\.tsx$/).keys();
export const getPreviewSlugs = async () => {
  const filepaths = [];

  for await (const filepath of walkDirectory("./src/foundations")) {
    if (filepath.endsWith(".preview.tsx")) {
      filepaths.push(filepath);
    }
  }

  return filepaths.map((filepath) => path.basename(filepath, ".preview.tsx"));
};
