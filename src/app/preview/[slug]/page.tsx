import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Spinner } from "@/foundations/ui/spinner";

import { imports } from "./imports";

export default async function Preview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const Component = imports[slug];

  if (!Component) notFound();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    </div>
  );
}
