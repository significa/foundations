import path from "path";

import { readFile } from "@/lib/fs";

import { Markdown } from "./markdown";
import { ExpandableCode } from "./expandable-code";

export const SourceCode = async ({ file }: { file: string }) => {
  const code = await readFile(
    path.join(process.cwd(), "src", ...file.split("/"))
  );

  const lang = path.extname(file).slice(1);

  return (
    <ExpandableCode>
      <Markdown>{`\`\`\`${lang}\n${code}\`\`\``}</Markdown>
    </ExpandableCode>
  );
};
