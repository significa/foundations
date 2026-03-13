"use client";

import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";

export default function ButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button onClick={() => setIsLoading(!isLoading)} isLoading={isLoading}>
      Click to toggle
    </Button>
  );
}
