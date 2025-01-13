"use client";

import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";
import { createContext, use, useState } from "react";

const PreviewSwitchContext = createContext<{
  view: "preview" | "code";
}>({
  view: "preview",
});

export const PreviewSwitch = ({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
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
      {!disabled && (
        <Button
          className="absolute right-2 bottom-2 z-10"
          size="sm"
          variant="outline"
          onClick={() => setView(view === "preview" ? "code" : "preview")}
        >
          {view === "preview" ? "View source" : "View preview"}
        </Button>
      )}
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
