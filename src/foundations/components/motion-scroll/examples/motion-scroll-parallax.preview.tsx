import { MotionScroll } from "#/foundations/components/motion-scroll/motion-scroll.tsx";
import type { PreviewMeta } from "#/lib/preview.ts";

const sections = [
  { label: "Design", bg: "bg-accent/10" },
  { label: "Build", bg: "bg-background-secondary" },
  { label: "Ship", bg: "bg-accent/5" },
];

const MotionScrollParallax = () => {
  return (
    <div>
      {/* Starts the boxes out of range so nothing jumps when the preview hydrates. */}
      <p className="flex h-screen items-center justify-center text-sm text-foreground-secondary">
        Scroll down
      </p>
      <div className="flex justify-around px-12 pb-[100vh]">
        {sections.map((_, index) => (
          <MotionScroll
            key={index}
            keyframes={{ y: [60 * index, -60 * index] }}
            offset={["start end", "end start"]}
            className="flex size-40 items-center justify-center rounded-lg border border-border bg-background-secondary text-sm text-foreground-secondary"
          >
            {index + 1}x
          </MotionScroll>
        ))}
      </div>
    </div>
  );
};

export const meta = {
  layout: "fullscreen",
  mode: "iframe",
} satisfies PreviewMeta;

export default MotionScrollParallax;
