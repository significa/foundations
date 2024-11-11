import { Suspense } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from '@/foundations/components/Spinner';
import { usePseudoDynamicComponent } from '@/lib/hooks/usePseudoDynamicComponent';

function Preview() {
  const { query, isReady } = useRouter();
  const path = Array.isArray(query.path) ? query.path[0] : query.path;
  const Component = usePseudoDynamicComponent(path);

  return (
    <div className="w-full h-full min-h-[--box-height] flex items-center justify-center">
      {!isReady && <Spinner />}
      {isReady && (
        <Suspense fallback={<Spinner />}>
          <Component />
        </Suspense>
      )}
    </div>
  );
}

export default Preview;
