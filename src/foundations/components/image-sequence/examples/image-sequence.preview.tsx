import { useEffect, useRef } from "react";

import type { ImageSequenceRef } from "../image-sequence";
import { ImageSequence } from "../image-sequence";

export const meta = { layout: "fullscreen", mode: "iframe" };

const sequence = import.meta.glob<{ default: ImageMetadata }>("@/assets/sequence/*.webp", {
  eager: true,
});

const frames = Object.values(sequence).map((m) => m.default);

const ImageSequencePreview = () => {
  const sequenceRef = useRef<ImageSequenceRef>(null);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      sequenceRef.current?.scrub(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ImageSequence frames={frames} ref={sequenceRef} />
      </div>
      <div className="h-[400vh]" />
    </div>
  );
};

export default ImageSequencePreview;
