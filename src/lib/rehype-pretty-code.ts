import { Options } from "rehype-pretty-code";

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
};
