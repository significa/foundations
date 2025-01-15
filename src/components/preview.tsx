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
  mode = "inline",
  layout = "centered",
  className,
  withSource = true,
}: {
  slug: string;
  mode?: "inline" | "iframe";
  layout?: "padded" | "centered" | "fullscreen";
  className?: string;
  withSource?: boolean;
}) {
  if (!imports[slug]) return null;

  const Component = imports[slug].component;

  return (
    <PreviewSwitch
      className={className}
      withSource={withSource}
      slug={slug}
      layout={layout}
    >
      <PreviewSwitchFrame>
        {mode === "iframe" ? (
          <iframe
            className="h-full w-full"
            src={`/preview/${slug}?layout=${layout}`}
          />
        ) : (
          <div
            className={cn(
              "h-full w-full",
              layout === "centered" &&
                "flex flex-col items-center justify-center",
              layout === "padded" && "p-4"
            )}
          >
            <Component />
          </div>
        )}
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
