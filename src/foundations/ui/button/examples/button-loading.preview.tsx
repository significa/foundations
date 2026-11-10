import { useState } from "react";

import { Button } from "#/foundations/ui/button/button.tsx";

export default function ButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  // A loading button ignores clicks, so the example settles on its own.
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Button onClick={handleClick} isLoading={isLoading}>
      Click to load
    </Button>
  );
}
