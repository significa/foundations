import path from "path";

import { readFile } from "@/lib/fs";

import { Markdown } from "./markdown";
import { ExpandableCode } from "./expandable-code";

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
  const code = await readFile(path.join(process.cwd(), "src", ...p.split("/")));

  const lang = path.extname(p).slice(1);

  return (
    <ExpandableCode>
      <Markdown>{`\`\`\`${lang}\n${rewriteImports(code)}\`\`\``}</Markdown>
    </ExpandableCode>
  );
};
