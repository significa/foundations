import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

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
      <Footer />
    </div>
  );
}
