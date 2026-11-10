import { useState } from "react";

import { useScrollLock } from "#/foundations/hooks/use-scroll-lock/use-scroll-lock.ts";
import { Button } from "#/foundations/ui/button/button.tsx";

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
