import { Spinner } from "@/foundations/ui/spinner/spinner";
import { useEffect, useState } from "react";

type ComponentPreviewProps = {
  file: string;
};

const modules = import.meta.glob("/src/foundations/**/*.preview.tsx");

const ComponentPreview = ({ file }: ComponentPreviewProps) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    try {
      modules[file]()
        .then((mod) => {
          // @ts-expect-error dynamic import is not typed
          setComponent(() => mod.default);
        })
        .catch((error) => {
          throw new Error(`Failed to load component for ${file}: ${error.message}`);
        });
    } catch (error) {
      console.error(`Error importing module for ${file}:`, error);
      setComponent(() => () => (
        <div className="space-y-2 p-4 text-sm text-red-700">
          <p>Error loading component:</p>
          <code className="text-foreground/60 bg-foreground/4 rounded-md border p-2 text-xs">{file}</code>
        </div>
      ));
    }
  }, [file]);

  if (!Component) {
    return (
      <div className="flex size-full items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  return <Component />;
};

export { ComponentPreview };
