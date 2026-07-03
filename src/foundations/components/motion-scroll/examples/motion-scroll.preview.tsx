import type { PreviewMeta } from "@/lib/preview";
import { MotionScroll } from "../motion-scroll";

const cards = [
  {
    title: "Foundations",
    description: "A curated set of primitives for building consistent, accessible interfaces.",
  },
  {
    title: "Motion",
    description: "Scroll-driven animations that respond naturally to user interaction.",
  },
  {
    title: "Composable",
    description: "Every component is designed to be combined and extended without friction.",
  },
];

const MotionScrollPreview = () => {
  return (
    <div className="flex flex-col items-center gap-32 px-8 pt-[50vh] pb-[50vh]">
      {cards.map((card, index) => (
        <MotionScroll
          key={index}
          keyframes={{ opacity: [0, 0, 1], y: ["33vh", 0] }}
          offset={["start end", "center center"]}
          ease="easeOut"
          className="w-full max-w-md rounded-xl border border-border bg-background-secondary p-8"
        >
          <p className="font-mono text-foreground-secondary text-xs uppercase tracking-widest">
            0{index + 1}
          </p>
          <h2 className="mt-2 font-semibold text-xl">{card.title}</h2>
          <p className="mt-1 text-foreground-secondary text-sm">{card.description}</p>
        </MotionScroll>
      ))}
    </div>
  );
};

export const meta = {
  layout: "fullscreen",
  mode: "iframe",
} satisfies PreviewMeta;

export default MotionScrollPreview;
