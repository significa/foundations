import { useElementSize } from "../use-element-size";

function UseElementSizeBasicPreview() {
  const [ref, size] = useElementSize<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="flex h-32 w-64 min-w-32 max-w-full resize items-center justify-center overflow-auto rounded-md border border-border bg-foreground/5 text-sm tabular-nums"
    >
      {size ? `${Math.round(size.width)} × ${Math.round(size.height)}` : "Measuring…"}
    </div>
  );
}

export default UseElementSizeBasicPreview;
