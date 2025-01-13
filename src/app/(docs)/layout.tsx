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
      <main className="mx-auto flex max-w-screen-2xl">
        <Sidebar />
        {children}
      </main>
      <Footer />
    </div>
  );
}
