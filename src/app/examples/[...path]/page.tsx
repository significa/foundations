import path from "path";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";

import { Spinner } from "@/foundations/ui/spinner";

export default async function Preview({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path: p } = await params;

  try {
    const Component = lazy(
      () => import(`/src/app/(foundations)/${p.join("/")}`)
    );

    const code = await fs.readFile(
      path.join(process.cwd(), "src", "app", "(foundations)", ...p),
      "utf-8"
    );

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Suspense fallback={<Spinner />}>
          <Component />
        </Suspense>
        <pre>{code}</pre>
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
