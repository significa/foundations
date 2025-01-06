"use client";

import { Button } from "@/foundations/ui/button";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggle = useCallback(() => {
    // disable transitions
    const style = document.createElement("style");
    const css = document.createTextNode(`* {
      -webkit-transition: none !important;
      -moz-transition: none !important;
      -o-transition: none !important;
      -ms-transition: none !important;
      transition: none !important;
    }`);
    style.appendChild(css);
    document.head.appendChild(style);

    // set theme
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

    // re-enable transitions
    setTimeout(() => {
      document.head.removeChild(style);
    }, 100);
  }, [resolvedTheme, setTheme]);

  return (
    <Button size="sm" square variant="ghost" onClick={toggle}>
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
