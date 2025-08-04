import { Markdown } from "./markdown";
import { ExpandableCode } from "./expandable-code";

interface SourceCodeProps {
  file: string;
  expandable?: boolean;
  withTitle?: boolean;
  className?: string;
}

export const SourceCode = ({
  file,
  expandable,
  withTitle,
  className,
}: SourceCodeProps) => {
  // const code = await readFile(path.join(process.cwd(), ...file.split("/")));

  // const filename = path.basename(file);
  // const lang = path.extname(file).slice(1);

  const code = `Hello world!`;
  const filename = "example.tsx";
  const lang = "tsx";

  const Wrapper = expandable ? ExpandableCode : "div";

  return (
    <Wrapper className={className}>
      <Markdown>{`\`\`\`${lang}${withTitle ? ` title="${filename}"` : ""}\n${code}\`\`\``}</Markdown>
    </Wrapper>
  );
};
