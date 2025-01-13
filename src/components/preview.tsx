import { imports } from "@/lib/examples-registry";
import { Markdown } from "./markdown";
import {
  PreviewSwitch,
  PreviewSwitchCode,
  PreviewSwitchFrame,
} from "./preview-switch";

export function Preview({
  slug,
  className,
  withSource = true,
}: {
  slug: string;
  className?: string;
  withSource?: boolean;
}) {
  if (!imports[slug]) return null;

  return (
    <PreviewSwitch className={className} disabled={!withSource}>
      <PreviewSwitchFrame>
        <iframe className="h-full w-full" src={`/preview/${slug}`} />
      </PreviewSwitchFrame>
      <PreviewSwitchCode>
        <div className="h-[400px] w-full overflow-auto">
          <Markdown>{`\`\`\`tsx\n${imports[slug].source}\n\`\`\``}</Markdown>
        </div>
      </PreviewSwitchCode>
    </PreviewSwitch>
  );
}
