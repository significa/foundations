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
        "relative w-full h-[400px] rounded-xl overflow-hidden border border-border",
        className
      )}
    >
      <PreviewSwitchContext value={{ view }}>{children}</PreviewSwitchContext>
      {!disabled && (
        <Button
          className="absolute z-10 bottom-2 right-2"
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
