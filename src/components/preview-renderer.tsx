import { useMemo } from "react";

type ComponentPreviewProps = {
  moduleKey: string;
  exportName: string;
};

const modules = import.meta.glob("/src/foundations/**/preview.tsx", { eager: true });

const PreviewRenderer = ({ moduleKey, exportName }: ComponentPreviewProps) => {
  const Component = useMemo(() => {
    try {
      // @ts-expect-error - dynamic import with glob
      const module = modules[moduleKey]?.[exportName];

      if (!module) {
        throw new Error(`Module or export not found: ${moduleKey} - ${exportName}`);
      }

      return module;
    } catch (error) {
      console.error(`Error loading module: ${error}`);
      return () => <div>Error loading component</div>;
    }
  }, [moduleKey, exportName]);

  return <Component />;
};

export { PreviewRenderer };
