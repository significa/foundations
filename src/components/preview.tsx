import { imports } from "@/lib/examples-registry";
import { Markdown } from "./markdown";
import {
  PreviewSwitch,
  PreviewSwitchCode,
  PreviewSwitchFrame,
} from "./preview-switch";
import { cn } from "@/lib/utils";

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
        <div
          className={cn(
            "h-[300px] w-full overflow-auto md:h-[400px]",
            "[&_pre[data-language]]:overflow-visible [&_pre[data-language]]:rounded-none [&_pre[data-language]]:border-transparent [&_pre[data-language]]:bg-transparent"
          )}
        >
          <Markdown>{`\`\`\`tsx\n${imports[slug].source}\`\`\``}</Markdown>
        </div>
      </PreviewSwitchCode>
    </PreviewSwitch>
  );
}
