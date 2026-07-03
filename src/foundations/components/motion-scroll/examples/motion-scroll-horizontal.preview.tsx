import { useMousePan } from "@/foundations/hooks/use-mouse-pan/use-mouse-pan";
import type { PreviewMeta } from "@/lib/preview";
import { MotionScroll } from "../motion-scroll";

const items = [
  { index: "01", label: "Design" },
  { index: "02", label: "Prototype" },
  { index: "03", label: "Build" },
  { index: "04", label: "Test" },
  { index: "05", label: "Ship" },
  { index: "06", label: "Iterate" },
];

const MotionScrollHorizontal = () => {
  const { ref } = useMousePan<HTMLUListElement>();

  return (
    <div className="flex h-screen items-center">
      <ul
        ref={ref}
        className="flex h-full w-full cursor-grab select-none snap-x snap-mandatory items-center gap-12 overflow-x-auto px-[40vw] py-12 active:cursor-grabbing"
      >
        {items.map((item) => (
          <MotionScroll
            key={item.index}
            asChild
            axis="x"
            keyframes={{ opacity: [0, 1, 0], scale: [0.85, 1, 0.85], rotate: [20, 0, -20] }}
            offset={["0 1", "1 0"]}
            scroller={(el) => el.parentElement as Element}
          >
            <li className="flex size-40 shrink-0 snap-center flex-col justify-between rounded-xl border border-border bg-background-secondary p-5">
              <span className="font-mono text-foreground-secondary text-xs">{item.index}</span>
              <span className="font-semibold text-xl">{item.label}</span>
            </li>
          </MotionScroll>
        ))}
      </ul>
    </div>
  );
};

export const meta = {
  layout: "fullscreen",
  mode: "iframe",
} satisfies PreviewMeta;

export default MotionScrollHorizontal;
