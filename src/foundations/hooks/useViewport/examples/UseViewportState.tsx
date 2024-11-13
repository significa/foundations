import { useViewport } from '@/foundations/hooks/useViewport';

export function UseViewportState() {
  const { width, height } = useViewport();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div>
        <p>
          <b>Viewport</b>
        </p>
        <p className="ml-6">
          <b>width:</b> {width}px
        </p>
        <p className="ml-6">
          <b>height:</b> {height}px
        </p>
      </div>
    </div>
  );
}
