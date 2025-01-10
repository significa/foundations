import path from "path";

export const GITHUB_REPO_URL = "https://github.com/significa/foundations";

export const getFoundationsPagePath = (slug: string[]) => {
  return path.join("src", "foundations", ...slug, "page.mdx");
};
