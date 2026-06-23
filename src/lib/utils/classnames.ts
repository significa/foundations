import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const {
  cva,
  cx: cn,
  compose,
} = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});
