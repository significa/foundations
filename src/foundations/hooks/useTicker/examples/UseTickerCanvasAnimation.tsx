import { useTicker } from '@/foundations/hooks/useTicker';
import { Button } from '@/foundations/components/Button';
import { useEffect, useRef } from 'react';

export function UseTickerCanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>();
  const angle = useRef(0);

  const ticker = useTicker((timestamp, delta) => {
    angle.current = (angle.current + delta / 500) % Math.PI;

    renderFrame();
  });

  function renderFrame(clearCanvas?: boolean) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    const radius = 24;
    const y = 1 - Math.sin(angle.current);

    if (clearCanvas) {
      context.clearRect(0, 0, width, height);
    }

    // cover canvas with white at 0.33 alpha to get the trailing effect
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = 'rgba(255, 255, 255, 0.33)';
    context.fill();

    // draw circle
    context.beginPath();
    context.arc(0.5 * width, radius + y * (height - 2 * radius), radius, 0, Math.PI * 2);
    context.fillStyle = '#222';
    context.fill();
  }

  function reset() {
    angle.current = 0;
    renderFrame(true);
  }

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute left-4 top-4 flex flex-col gap-3">
        <Button onClick={ticker.start}>Start</Button>
        <Button variant="secondary" onClick={ticker.stop}>
          Stop
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="absolute h-full mix-blend-multiply"
      />
    </div>
  );
}
