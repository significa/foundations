import { useIsTouchscreen } from '@/foundations/hooks/useIsTouchscreen';

export function UseIsTouchscreenBasicUsage() {
  const isTouchscreen = useIsTouchscreen();

  return (
    <div className="text-center">
      I believe you <b>{isTouchscreen ? 'are' : "aren't"}</b> seeing this on a touchscreen
    </div>
  );
}
