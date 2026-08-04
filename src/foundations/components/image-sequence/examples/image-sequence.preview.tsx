import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import type { ImageSequenceRef } from "../image-sequence";
import { ImageSequence } from "../image-sequence";

export const meta = { layout: "fullscreen", mode: "iframe" };

const frames = [
  "/src/assets/sequence/001-frame.webp",
  "/src/assets/sequence/002-frame.webp",
  "/src/assets/sequence/003-frame.webp",
  "/src/assets/sequence/004-frame.webp",
  "/src/assets/sequence/005-frame.webp",
  "/src/assets/sequence/006-frame.webp",
  "/src/assets/sequence/007-frame.webp",
  "/src/assets/sequence/008-frame.webp",
  "/src/assets/sequence/009-frame.webp",
  "/src/assets/sequence/010-frame.webp",
  "/src/assets/sequence/011-frame.webp",
  "/src/assets/sequence/012-frame.webp",
  "/src/assets/sequence/013-frame.webp",
  "/src/assets/sequence/014-frame.webp",
  "/src/assets/sequence/015-frame.webp",
  "/src/assets/sequence/016-frame.webp",
  "/src/assets/sequence/017-frame.webp",
  "/src/assets/sequence/018-frame.webp",
  "/src/assets/sequence/019-frame.webp",
  "/src/assets/sequence/020-frame.webp",
  "/src/assets/sequence/021-frame.webp",
  "/src/assets/sequence/022-frame.webp",
  "/src/assets/sequence/023-frame.webp",
  "/src/assets/sequence/024-frame.webp",
  "/src/assets/sequence/025-frame.webp",
  "/src/assets/sequence/026-frame.webp",
  "/src/assets/sequence/027-frame.webp",
  "/src/assets/sequence/028-frame.webp",
  "/src/assets/sequence/029-frame.webp",
  "/src/assets/sequence/030-frame.webp",
  "/src/assets/sequence/031-frame.webp",
  "/src/assets/sequence/032-frame.webp",
  "/src/assets/sequence/033-frame.webp",
  "/src/assets/sequence/034-frame.webp",
  "/src/assets/sequence/035-frame.webp",
  "/src/assets/sequence/036-frame.webp",
  "/src/assets/sequence/037-frame.webp",
  "/src/assets/sequence/038-frame.webp",
  "/src/assets/sequence/039-frame.webp",
  "/src/assets/sequence/040-frame.webp",
  "/src/assets/sequence/041-frame.webp",
  "/src/assets/sequence/042-frame.webp",
  "/src/assets/sequence/043-frame.webp",
  "/src/assets/sequence/044-frame.webp",
  "/src/assets/sequence/045-frame.webp",
  "/src/assets/sequence/046-frame.webp",
  "/src/assets/sequence/047-frame.webp",
  "/src/assets/sequence/048-frame.webp",
];

const ImageSequencePreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<ImageSequenceRef>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    sequenceRef.current?.scrub(progress);
  });

  return (
    <div ref={containerRef}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ImageSequence frames={frames} ref={sequenceRef} />
      </div>
      <div className="h-[400vh]" />
    </div>
  );
};

export default ImageSequencePreview;
