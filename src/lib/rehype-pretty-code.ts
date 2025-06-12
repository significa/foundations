import { Options } from "rehype-pretty-code";
import { getSingletonHighlighter } from "shiki";

export const rehypePrettyCodeOptions: Options = {
  theme: {
    dark: "github-dark-default",
    light: "kanagawa-lotus",
  },
  keepBackground: false,
  defaultLang: {
    block: "js",
    inline: "text",
  },
  getHighlighter: getSingletonHighlighter,
};
