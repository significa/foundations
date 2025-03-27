"use client";

import { useScrollLock } from "@/foundations/hooks/use-scroll-lock/use-scroll-lock";
import { useState } from "react";
import { Button } from "@/foundations/ui/button/button";

const UseScrollLockPreview = () => {
  const [isLocked, setIsLocked] = useState(false);

  useScrollLock(isLocked);

  return (
    <Button onClick={() => setIsLocked(!isLocked)} size="sm">
      {isLocked ? "Unlock" : "Lock"}
    </Button>
  );
};

export default UseScrollLockPreview;
