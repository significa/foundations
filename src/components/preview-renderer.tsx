import { useMemo } from "react";

type ComponentPreviewProps = {
  moduleKey: string;
};

const modules = import.meta.glob("/src/foundations/**/*.preview.tsx", { eager: true });

const PreviewRenderer = ({ moduleKey }: ComponentPreviewProps) => {
  const Component = useMemo(() => {
    try {
      // @ts-expect-error - dynamic import with glob
      const module = modules[moduleKey]?.default;

      if (!module) {
        throw new Error(`Module not found: ${moduleKey}`);
      }

      return module;
    } catch (error) {
      console.error(`Error loading module: ${error}`);
      return () => <div>Error loading component</div>;
    }
  }, [moduleKey]);

  return <Component />;
};

export { PreviewRenderer };
