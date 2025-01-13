"use client";

import { Button } from "@/foundations/ui/button/button";
import { List } from "@phosphor-icons/react";

export const HeaderMobileButton = () => {
  return (
    <Button
      className="xl:hidden"
      variant="ghost"
      size="sm"
      square
      aria-label="Open menu"
    >
      <List />
    </Button>
  );
};
