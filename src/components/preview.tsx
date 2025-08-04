import { Suspense } from "react";

import { cn } from "@/lib/utils";

import { DynamicComponent } from "./dynamic-component";
import { PreviewLayout } from "./preview-layout";
import {
  PreviewSwitch,
  PreviewSwitchCode,
  PreviewSwitchFrame,
} from "./preview-switch";
import { SourceCode } from "./source-code";

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
  // const filepath = await getPreviewSourcePath(slug);
  const filepath = '/foo/bar.tsx'; // Placeholder for the file path

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
              {filepath && <DynamicComponent file={filepath} />}
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
          {filepath && <SourceCode file={filepath} />}
        </div>
      </PreviewSwitchCode>
    </PreviewSwitch>
  );
}
