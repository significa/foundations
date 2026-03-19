/**
 * ComponentPreviewHydrator
 *
 * A somewhat hacky but effective way to achieve code-split glob imports without
 * loading states or layout shifts.
 *
 * How it works:
 * - `component-preview.astro` renders the preview component on the server (SSR),
 *   passing the server-rendered output as `children`.
 * - On the client, this component mounts and dynamically fetches the actual
 *   React module for the given `file` via a Vite glob import.
 * - Once the module is loaded, it swaps out `children` (the static server HTML)
 *   with the fully hydrated React component.
 *
 * The key benefit: because the server-rendered HTML and the hydrated React
 * component produce identical output, the swap is seamless — no spinners,
 * no loading states, no visible flash or layout shift.
 */
import { useEffect, useState } from 'react';

type ComponentPreviewProps = {
  file: string;
  children: React.ReactNode;
};

// Eagerly collect all preview modules via Vite's glob import.
// Each module is lazily loaded (code-split) — only the requested file is
// actually fetched at runtime.
const modules = import.meta.glob('/src/foundations/**/*.preview.tsx');

const ComponentPreviewHydrator = ({
  file,
  children,
}: ComponentPreviewProps) => {
  // Starts as null (no module loaded yet), then holds the hydrated component once fetched.
  const [Component, setComponent] = useState<React.ComponentType | null>();

  useEffect(() => {
    try {
      // Dynamically import only the preview module for the given file.
      // This triggers the code-split chunk load for that specific preview.
      modules[file]().then((mod) => {
        // @ts-expect-error - We know this will be a React component, but TypeScript can't infer it from the dynamic import.
        setComponent(() => mod.default);
      });
    } catch (error) {
      console.error(
        `Failed to hydrate preview component for file: ${file}`,
        error
      );
    }
  }, [file]);

  // Render `children` (the server-rendered HTML) until the hydrated component is ready
  return <div>{Component ? <Component /> : children}</div>;
};

export { ComponentPreviewHydrator };
