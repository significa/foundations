import type { ComponentPropsWithoutRef, Ref } from "react";
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";

const clamp = (min: number, value: number, max: number) => Math.max(min, Math.min(value, max));

interface ImageSequenceRef {
  scrub: (progress: number) => void;
}

interface ImageSequenceProps extends ComponentPropsWithoutRef<"canvas"> {
  frames: ImageMetadata[];
  ref?: Ref<ImageSequenceRef>;
}

const ImageSequence = ({ frames, ref, ...props }: ImageSequenceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);

  const firstFrame = frames[0];
  if (!firstFrame) throw new Error("[image-sequence]: frames must not be empty");

  const scrub = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context || !canvas) return;

    const loaded = framesRef.current;
    const index = clamp(0, Math.floor(progress * loaded.length), loaded.length - 1);
    const image = loaded[index];

    if (image) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  useImperativeHandle(ref, () => ({ scrub }), [scrub]);

  useEffect(() => {
    framesRef.current = [];

    const sources = frames
      .map(({ src }) => src)
      .sort((a, b) => {
        const basenameA = a.split("/").pop();
        const basenameB = b.split("/").pop();

        const indexA = parseInt(basenameA?.split("-")[0] ?? "0", 10);
        const indexB = parseInt(basenameB?.split("-")[0] ?? "0", 10);

        return indexA - indexB;
      });

    let abort: AbortController | undefined;

    const start = () => {
      abort = progressivelyLoadFrames(sources, [16, 8, 4, 2, 1], (frame, index) => {
        framesRef.current[index] = frame;
        if (index === 0) scrub(0);
      });
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      abort?.abort();
    };
  }, [frames, scrub]);

  return (
    <canvas
      ref={canvasRef}
      width={firstFrame.width}
      height={firstFrame.height}
      {...props}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...props.style }}
    />
  );
};

// load frames progressively in steps
// examples: steps = [4,2,1] first renders every 4th frame, then every 2nd frame, then every 1st frame
function progressivelyLoadFrames(
  images: string[],
  steps: [...number[], 1],
  onLoad: (image: HTMLImageElement, index: number) => void,
): AbortController {
  const abortController = new AbortController();
  const cache = new Map<string, HTMLImageElement>();

  function loadImage(src: string): Promise<HTMLImageElement> {
    const cached = cache.get(src);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        cache.set(src, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image ${src}`));
      img.src = src;
    });
  }

  async function runStep(step: number, rendered: number[]) {
    const batch: Promise<HTMLImageElement>[] = [];

    for (let i = 0; i < images.length; i += step) {
      // wait for previous batch to finish, before starting a new one
      if (i !== 0) await Promise.all(batch);

      const src = images[i];
      if (!src || rendered.includes(i) || abortController.signal.aborted) continue;

      const imagePromise = loadImage(src);
      batch.push(imagePromise);
      void imagePromise.then((img) => {
        onLoad(img, i);
        rendered.push(i);
      });
    }
  }

  void (async () => {
    const rendered: number[] = [];
    for (const step of steps) {
      if (abortController.signal.aborted) break;
      await runStep(step, rendered);
    }
  })();

  return abortController;
}

export type { ImageSequenceRef };
export { ImageSequence };
