import { Header } from "@/components/header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div>
        <aside>Sidebar</aside>
        <main>{children}</main>
      </div>
    </>
  );
}
