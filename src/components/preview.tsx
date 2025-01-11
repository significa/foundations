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
        <iframe className="w-full h-full" src={`/preview/${slug}`} />
      </PreviewSwitchFrame>
      <PreviewSwitchCode>
        <div className="w-full h-[400px] overflow-auto">
          <Markdown>{`\`\`\`tsx\n${imports[slug].source}\n\`\`\``}</Markdown>
        </div>
      </PreviewSwitchCode>
    </PreviewSwitch>
  );
}
