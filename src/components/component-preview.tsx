import { lazy, Suspense, useMemo } from 'react';
import { Spinner } from '@/foundations/ui/spinner/spinner';
import type { PreviewLayout } from '@/lib/preview';
import { cn } from '@/lib/utils/classnames';

type ComponentPreviewProps = {
  file: string;
  layout?: PreviewLayout;
};

const modules = import.meta.glob('/src/foundations/**/*.preview.tsx');

const ComponentPreview = ({
  file,
  layout = 'centered',
}: ComponentPreviewProps) => {
  const Component = useMemo(
    () =>
      lazy(() => {
        try {
          return modules[file]().then((mod) => ({
            // @ts-expect-error dynamic import is not typed
            default: mod.default as React.ComponentType,
          }));
        } catch (err) {
          console.error(`Error loading component preview for ${file}:`, err);
          return Promise.resolve({
            default: () => (
              <div className="space-y-3 p-4 text-red-700 text-xs">
                <p>Error loading component:</p>
                <code className="rounded-md border border-red-200 bg-red-50 p-2 text-red-500">
                  {file}
                </code>
              </div>
            ),
          });
        }
      }),
    [file]
  );

  return (
    <div
      className={cn(
        layout === 'centered'
          ? 'flex h-full w-full flex-col items-center justify-center overflow-auto p-4'
          : layout === 'padded'
            ? 'h-full w-full overflow-auto p-4'
            : 'contents'
      )}
    >
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center p-2 opacity-32">
            <Spinner />
          </div>
        }
      >
        <Component />
      </Suspense>
    </div>
  );
};

export { ComponentPreview };
