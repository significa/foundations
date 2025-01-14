import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Spinner } from "@/foundations/ui/spinner/spinner";

import { imports } from "@/lib/examples-registry";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return Object.keys(imports).map((slug) => ({ slug }));
}

export default async function Preview({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ layout: "centered" | "padded" | "fullscreen" }>;
}) {
  const { slug } = await params;
  const { layout = "centered" } = await searchParams;

  const Component = imports[slug].component;

  if (!Component) notFound();

  return (
    <div
      className={cn(
        "h-full w-full",
        layout === "centered" && "flex flex-col items-center justify-center",
        layout === "padded" && "p-4"
      )}
    >
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    </div>
  );
}
