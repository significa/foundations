import { promises as fs } from "fs";
import path from "path";

import { Markdown } from "./markdown";

const rewriteImports = (code: string) => {
  return (
    code
      // Replace @/foundations/ui with @/components
      .replace(/@\/foundations\/ui/g, "@/components")
      // Remove duplicate folder names (e.g. @/components/button/button to @/components/button)
      .replace(/\/([^/]+)\/\1/g, "/$1")
  );
};

export const SourceCode = async ({ path: p }: { path: string }) => {
  const code = await fs.readFile(
    path.join(process.cwd(), "src", ...p.split("/")),
    "utf-8"
  );

  const lang = path.extname(p).slice(1);

  return <Markdown>{`\`\`\`${lang}\n${rewriteImports(code)}\`\`\``}</Markdown>;
};
