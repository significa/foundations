import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";

import { useElementSize } from "../use-element-size";

const SHORT = "Saved.";
const LONG =
  "Saved. Your changes are live, and anyone with the link will see the new version next time they open it.";

function UseElementSizeContentPreview() {
  const [long, setLong] = useState(false);
  // measure the content, then give the box that size, so it eases instead of snapping
  const [ref, size] = useElementSize<HTMLDivElement>();

  return (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm" variant="outline" onClick={() => setLong((v) => !v)}>
        {long ? "Shorter" : "Longer"}
      </Button>
      <div
        style={size}
        className="box-content overflow-hidden rounded-md border border-border bg-background shadow-sm motion-safe:transition-[width,height] motion-safe:duration-500 motion-safe:ease-spring"
      >
        <div ref={ref} className="w-max max-w-72 p-3 text-sm">
          {long ? LONG : SHORT}
        </div>
      </div>
    </div>
  );
}

export default UseElementSizeContentPreview;
