import { useIsMounted } from '@/foundations/hooks/useIsMounted';

export function UseIsMountedConditionalRendering() {
  const isMounted = useIsMounted();

  if (isMounted) {
    return <div>Client-only render</div>;
  }

  return null;
}
