import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const imports: Record<string, ComponentType> = {
  button: dynamic(
    () => import("@/foundations/ui/button/preview/button.preview")
  ),
};
