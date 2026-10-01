import { useRef } from "react";

import { useElementSize } from "../use-element-size";

function UseElementSizeCallbackPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const renders = useRef(0);
  renders.current += 1;

  // writes a CSS variable on every resize, without re-rendering
  const [ref] = useElementSize<HTMLDivElement>({}, ({ width }) => {
    rootRef.current?.style.setProperty("--panel-width", `${width}px`);
  });

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div
        ref={ref}
        className="h-24 w-64 min-w-24 max-w-full resize-x overflow-auto rounded-md border border-border bg-foreground/5 p-3 text-sm"
      >
        Drag the corner. Rendered {renders.current} time{renders.current === 1 ? "" : "s"}.
      </div>
      <div className="h-1.5 w-(--panel-width) rounded-full bg-foreground/40" />
    </div>
  );
}

export default UseElementSizeCallbackPreview;
