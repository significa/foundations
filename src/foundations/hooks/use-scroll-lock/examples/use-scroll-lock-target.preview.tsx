"use client";

import { useState } from "react";

import { useScrollLock } from "@/foundations/hooks/use-scroll-lock/use-scroll-lock";
import { Button } from "@/foundations/ui/button/button";

const UseScrollLockTargetPreview = () => {
  const [isLocked, setIsLocked] = useState(false);

  useScrollLock(isLocked, "#scroll-lock-target");

  return (
    <>
      <main
        id="scroll-lock-target"
        className="absolute inset-0 overflow-y-auto"
      >
        <div className="h-[2000px]" />
      </main>
      <div
        className="text-foreground-secondary absolute inset-0 flex items-center justify-center"
        inert
      >
        Scroll me
      </div>
      <Button
        onClick={() => setIsLocked(!isLocked)}
        className="absolute top-4 left-4"
        size="sm"
      >
        {isLocked ? "Unlock" : "Lock"}
      </Button>
    </>
  );
};

export default UseScrollLockTargetPreview;
