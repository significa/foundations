import { Fragment } from "react";

import path from "path";

import { readFile } from "@/lib/fs";

import { Markdown } from "./markdown";
import { ExpandableCode } from "./expandable-code";

interface SourceCodeProps {
  file: string;
  expandable?: boolean;
}

export const SourceCode = async ({ file, expandable }: SourceCodeProps) => {
  const code = await readFile(
    path.join(process.cwd(), "src", ...file.split("/"))
  );

  const lang = path.extname(file).slice(1);

  const Wrapper = expandable ? ExpandableCode : Fragment;

  return (
    <Wrapper>
      <Markdown>{`\`\`\`${lang}\n${code}\`\`\``}</Markdown>
    </Wrapper>
  );
};
