import path from "path";

import { readFile } from "@/lib/fs";

import { ExpandableCode } from "./expandable-code";
import { Markdown } from "./markdown";

interface SourceCodeProps {
  file: string;
  expandable?: boolean;
  withTitle?: boolean;
  className?: string;
}

export const SourceCode = async ({
  file,
  expandable,
  withTitle,
  className,
}: SourceCodeProps) => {
  const code = await readFile(path.join(process.cwd(), ...file.split("/")));

  const filename = path.basename(file);
  const lang = path.extname(file).slice(1);

  const Wrapper = expandable ? ExpandableCode : "div";

  return (
    <Wrapper className={className}>
      <Markdown>{`\`\`\`${lang}${withTitle ? ` title="${filename}"` : ""}\n${code}\`\`\``}</Markdown>
    </Wrapper>
  );
};
