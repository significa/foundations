import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DynamicComponent } from "@/components/dynamic-component";
import { PreviewLayout } from "@/components/preview-layout";
import { getPreviewSlugs, getPreviewSourcePath } from "@/lib/preview";

export async function generateStaticParams() {
  const slugs = await getPreviewSlugs();

  return slugs.map((slug) => ({ slug }));
}

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

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
        <DynamicComponent file={filepath} />
      </PreviewLayout>
    </Suspense>
  );
}
