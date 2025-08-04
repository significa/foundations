export const GITHUB_REPO_URL = "https://github.com/significa/foundations";

export const getFoundationsPagePath = (slug: string[]) => {
  return ["src", "foundations", ...slug, "page.mdx"].join("/");
};