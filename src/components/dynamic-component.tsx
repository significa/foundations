import dynamic from "next/dynamic";
import { Suspense } from "react";

import { Spinner } from "@/foundations/ui/spinner/spinner";

interface DynamicComponent {
  file: string;
}

export const DynamicComponent = async ({ file }: DynamicComponent) => {
  if (!file.startsWith("src/foundations/")) {
    throw new Error(
      "DynamicComponent: Unsupported file path (must start with 'src/foundations/')"
    );
  }

  if (!file.endsWith(".tsx")) {
    throw new Error(
      "DynamicComponent: Unsupported file extension (must be .tsx)"
    );
  }

  const dynamicPathFragment = file
    .replace("src/foundations/", "")
    .replace(".tsx", "");

  const Component = dynamic(() =>
    import(`../foundations/${dynamicPathFragment}.tsx`).catch((error) => {
      console.error(`Failed to load component: ${file}`, error);
      throw new Error(`Failed to load component: ${file}`);
    })
  );

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};
