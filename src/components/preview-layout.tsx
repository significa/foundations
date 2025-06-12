"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface PreviewLayoutProps {
  layout?: "fullscreen" | "centered" | "padded";
  children: React.ReactNode;
}

export const PreviewLayout = ({
  layout: layoutProp,
  children,
}: PreviewLayoutProps) => {
  const params = useSearchParams();
  const layout = layoutProp || params.get("layout") || "centered";

  return (
    <div
      className={cn(
        layout === "centered"
          ? "flex h-full w-full flex-col items-center justify-center overflow-auto p-4"
          : layout === "padded"
            ? "h-full w-full overflow-auto p-4"
            : "contents"
      )}
    >
      {children}
    </div>
  );
};
