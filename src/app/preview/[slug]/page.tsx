import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FoundationsComponent } from "@/components/foundations-component";
import { PreviewLayout } from "@/components/preview-layout";
import { getPreviewSourcePath, getPreviewSlugs } from "@/lib/preview";

export async function generateStaticParams() {
  const slugs = await getPreviewSlugs();

  return slugs.map((slug) => ({ slug }));
}

export default async function Preview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filepath = await getPreviewSourcePath(slug);

  if (!filepath) notFound();

  return (
    <Suspense>
      <PreviewLayout>
        <FoundationsComponent file={filepath} />
      </PreviewLayout>
    </Suspense>
  );
}
