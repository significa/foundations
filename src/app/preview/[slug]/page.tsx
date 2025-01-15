import { notFound } from "next/navigation";

import { imports } from "@/lib/examples-registry";

export async function generateStaticParams() {
  return Object.keys(imports).map((slug) => ({ slug }));
}

export default async function Preview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const Component = imports[slug].component;

  if (!Component) notFound();

  return <Component />;
}
