import { useElementSize } from "#/foundations/hooks/use-element-size/use-element-size.ts";

function UseElementSizeBasicPreview() {
  const [ref, size] = useElementSize<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="flex h-32 w-64 max-w-full min-w-32 resize items-center justify-center overflow-auto rounded-md border border-border bg-foreground/5 text-sm tabular-nums"
    >
      {size ? `${Math.round(size.width)} × ${Math.round(size.height)}` : "Measuring…"}
    </div>
  );
}

export default UseElementSizeBasicPreview;
