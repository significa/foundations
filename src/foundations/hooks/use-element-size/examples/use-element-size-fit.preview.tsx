import { useElementSize } from "../use-element-size";

const PEOPLE = ["AM", "BK", "CL", "DS", "EN", "FO", "GP", "HR", "IT", "JV", "KW", "LZ"];
const AVATAR = 32;
const GAP = 4;

function UseElementSizeFitPreview() {
  const [ref, size] = useElementSize<HTMLDivElement>({ box: "content-box" });

  // as many avatars as fit, keeping one slot for "+N" when some are left over
  const slots = size ? Math.max(1, Math.floor((size.width + GAP) / (AVATAR + GAP))) : 0;
  const shown = PEOPLE.length > slots ? Math.max(0, slots - 1) : PEOPLE.length;
  const hidden = PEOPLE.length - shown;

  return (
    <div
      ref={ref}
      className="flex w-80 min-w-16 max-w-full resize-x gap-1 overflow-hidden rounded-md border border-border p-2"
    >
      {PEOPLE.slice(0, shown).map((initials) => (
        <span
          key={initials}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs"
        >
          {initials}
        </span>
      ))}
      {size && hidden > 0 && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs">
          +{hidden}
        </span>
      )}
    </div>
  );
}

export default UseElementSizeFitPreview;
