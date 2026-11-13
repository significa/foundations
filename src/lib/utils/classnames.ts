import { defineConfig } from "cva";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only knows Tailwind's own theme names: an unknown `shadow-control` would sit beside
// `shadow-none` instead of being replaced by it. Register custom names here (theme keys: shadow,
// text, radius, …); colour names need no registration.
const twMerge = extendTailwindMerge({
  extend: { theme: { shadow: ["control", "control-pressed"] } },
});

export const {
  cva,
  cx: cn,
  compose,
} = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});
