"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useSearchParams();
  const layout = params.get("layout") || "fullscreen";

  return (
    <div
      className={cn(
        "h-full w-full",
        layout === "centered" && "flex flex-col items-center justify-center",
        layout === "padded" && "p-4"
      )}
    >
      {children}
    </div>
  );
}
