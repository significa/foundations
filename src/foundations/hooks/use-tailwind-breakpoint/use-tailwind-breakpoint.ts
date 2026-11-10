import theme from "tailwindcss/defaultTheme";

import { useMatchMedia } from "#/foundations/hooks/use-match-media/use-match-media.ts";

const breakpoints = theme?.screens as Record<string, string>;

type Breakpoint = keyof typeof breakpoints;

export const useTailwindBreakpoint = (breakpoint: Breakpoint) => {
  const query = breakpoints[breakpoint];
  return useMatchMedia(`(min-width: ${query})`);
};
