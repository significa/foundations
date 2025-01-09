import { Header } from "./header";
import { Sidebar } from "./sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="grid grid-cols-[250px_1fr]">
        <Sidebar />
        <main className="py-12">
          <div className="max-w-4xl mx-auto">{children}</div>
          <div className="sticky top-14">Table of contents</div>
        </main>
      </main>
      <footer className="border-t border-border">Footer here</footer>
    </div>
  );
}
