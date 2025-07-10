"use client";

import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { createContext, use, useState } from "react";

const PreviewSwitchContext = createContext<{
  view: "preview" | "code";
}>({
  view: "preview",
});

export const PreviewSwitch = ({
  children,
  className,
  withSource,
  slug,
  layout,
}: {
  children: React.ReactNode;
  className?: string;
  withSource?: boolean;
  slug: string;
  layout?: "padded" | "centered" | "fullscreen";
}) => {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div
      className={cn(
        "border-border relative h-[300px] w-full overflow-hidden rounded-xl border md:h-[400px]",
        className
      )}
    >
      <PreviewSwitchContext value={{ view }}>{children}</PreviewSwitchContext>
      <div className="absolute right-2 bottom-2 z-10 flex items-center gap-2">
        {withSource && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setView(view === "preview" ? "code" : "preview")}
          >
            {view === "preview" ? "View source" : "View preview"}
          </Button>
        )}
        <Button
          asChild
          size="sm"
          variant="outline"
          square
          aria-label="Open in new window"
        >
          <a href={`/preview/${slug}?layout=${layout}`} target="_blank">
            <ArrowSquareOutIcon />
          </a>
        </Button>
      </div>
    </div>
  );
};

export const PreviewSwitchFrame = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { view } = use(PreviewSwitchContext);

  return view === "preview" ? children : null;
};

export const PreviewSwitchCode = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { view } = use(PreviewSwitchContext);

  return view === "code" ? children : null;
};
