import { promises as fs } from "fs";
import path from "path";

import { notFound } from "next/navigation";

import { MdxPage } from "@/components/mdx-page";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  try {
    const code = await fs.readFile(
      path.join(process.cwd(), "src", "foundations", ...slug, "page.mdx"),
      "utf-8"
    );
    return <MdxPage code={code} />;
  } catch (_error) {
    notFound();
  }
}
