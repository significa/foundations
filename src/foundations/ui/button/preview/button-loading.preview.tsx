"use client";

import { Button } from "@/foundations/ui/button/button";
import { useState } from "react";

export default function ButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button onClick={() => setIsLoading(!isLoading)} isLoading={isLoading}>
      Click to toggle
    </Button>
  );
}
