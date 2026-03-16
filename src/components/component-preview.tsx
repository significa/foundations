import { useMemo } from "react";

type ComponentPreviewProps = {
  file: string;
};

const modules = import.meta.glob("/src/foundations/**/*.preview.tsx", { eager: true });

const ComponentPreview = ({ file }: ComponentPreviewProps) => {
  const Component = useMemo(() => {
    try {
      // @ts-expect-error - dynamic import with glob
      const module = modules[file]?.default;

      if (!module) {
        throw new Error(`Module not found: ${file}`);
      }

      return module;
    } catch (error) {
      console.error(`Error loading module: ${error}`);
      return () => <div>Error loading component</div>;
    }
  }, [file]);

  return <Component />;
};

export { ComponentPreview };
