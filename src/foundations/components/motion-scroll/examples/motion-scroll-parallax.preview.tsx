import type { PreviewMeta } from "@/lib/preview";
import { MotionScroll } from "../motion-scroll";

const sections = [
  { label: "Design", bg: "bg-accent/10" },
  { label: "Build", bg: "bg-background-secondary" },
  { label: "Ship", bg: "bg-accent/5" },
];

const MotionScrollParallax = () => {
  return (
    <div className="flex justify-around px-12 pt-[30vh] pb-[30vh]">
      {sections.map((_, index) => (
        <MotionScroll
          key={index}
          keyframes={{ y: [60 * index, -60 * index] }}
          offset={["start end", "end start"]}
          className="my-[50vh] flex size-40 items-center justify-center rounded-lg border border-border bg-background-secondary text-foreground-secondary text-sm"
        >
          {index + 1}x
        </MotionScroll>
      ))}
    </div>
  );
};

export const meta = {
  layout: "fullscreen",
  mode: "iframe",
} satisfies PreviewMeta;

export default MotionScrollParallax;
