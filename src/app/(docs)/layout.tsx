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
      <main className="flex max-w-screen-2xl mx-auto">
        <Sidebar />
        {children}
      </main>
      <footer className="border-t border-border">Footer here</footer>
    </div>
  );
}
