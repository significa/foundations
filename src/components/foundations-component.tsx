import dynamic from "next/dynamic";
import { Suspense } from "react";

export const FoundationsComponent = async ({ file }: { file: string }) => {
  const dynamicPathFragment = file
    .replace("src/foundations/", "")
    .replace(".tsx", "");

  const Component = dynamic(
    () => import(`../foundations/${dynamicPathFragment}.tsx`)
  );

  return (
    <Suspense>
      <Component />
    </Suspense>
  );
};
