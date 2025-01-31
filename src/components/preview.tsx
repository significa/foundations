import { Suspense } from "react";

import { getPreviewSourcePath } from "@/lib/preview";
import { cn } from "@/lib/utils";

import { FoundationsComponent } from "./foundations-component";
import { PreviewLayout } from "./preview-layout";
import {
  PreviewSwitch,
  PreviewSwitchCode,
  PreviewSwitchFrame,
} from "./preview-switch";
import { SourceCode } from "./source-code";

export async function Preview({
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
  const filepath = await getPreviewSourcePath(slug);

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
              {filepath && <FoundationsComponent file={filepath} />}
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
