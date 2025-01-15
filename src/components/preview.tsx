import { imports } from "@/lib/examples-registry";
import { Markdown } from "./markdown";
import {
  PreviewSwitch,
  PreviewSwitchCode,
  PreviewSwitchFrame,
} from "./preview-switch";
import { cn } from "@/lib/utils";
import { PreviewLayout } from "./preview-layout";
import { Suspense } from "react";

export function Preview({
  slug,
  mode = "inline",
  layout = "centered",
  className,
  withSource = true,
}: {
  slug: string;
  mode?: "inline" | "iframe";
  layout?: React.ComponentProps<typeof PreviewLayout>["layout"];
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
          <Suspense>
            <PreviewLayout layout={layout}>
              <Component />
            </PreviewLayout>
          </Suspense>
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
