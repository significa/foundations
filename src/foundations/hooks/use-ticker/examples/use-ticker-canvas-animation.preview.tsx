"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  PlayIcon,
  SquareIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";

import { useTicker } from "@/foundations/hooks/use-ticker/use-ticker";
import { Button } from "@/foundations/ui/button/button";

const UseTickerCanvasAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useRef(0);

  const ticker = useTicker((timestamp, delta) => {
    timeElapsed.current += delta;

    if (canvasRef.current) {
      renderFrame(canvasRef.current, timeElapsed.current);
    }
  });

  const reset = useCallback(() => {
    timeElapsed.current = 0;

    if (canvasRef.current) {
      renderFrame(canvasRef.current, timeElapsed.current, true);
    }
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute top-2 left-2 z-10 flex justify-start gap-2">
        <Button onClick={ticker.start} size="sm">
          <PlayIcon size={16} />
          Start
        </Button>
        <Button variant="outline" onClick={ticker.stop} size="sm">
          <SquareIcon size={16} />
          Stop
        </Button>
        <Button variant="outline" onClick={reset} size="sm">
          <ArrowCounterClockwiseIcon size={16} />
          Reset
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute h-full mix-blend-multiply"
      />
    </div>
  );
};

function renderFrame(
  canvas: HTMLCanvasElement,
  progress: number,
  clearCanvas?: boolean
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const angle = (progress * 0.002) % Math.PI;

  const { width, height } = canvas;
  const radius = 24;
  const y = 1 - Math.sin(angle) * 0.8;

  if (clearCanvas) {
    context.clearRect(0, 0, width, height);
  }

  // cover canvas with white at 0.33 alpha to get the trailing effect
  context.beginPath();
  context.rect(0, 0, width, height);
  context.fillStyle = "rgba(255, 255, 255, 0.33)";
  context.fill();

  // draw circle
  context.beginPath();
  context.arc(
    0.5 * width,
    radius + y * (height - 2 * radius),
    radius,
    0,
    Math.PI * 2
  );
  context.fillStyle = "#222";
  context.fill();
}

export default UseTickerCanvasAnimation;
