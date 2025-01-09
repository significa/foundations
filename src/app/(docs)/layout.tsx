import { Egg } from "@/components/icons/egg";
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
      <footer className="border-t border-border">
        <div className="max-w-screen-2xl mx-auto py-8 text-foreground-secondary">
          <Egg className="text-foreground" />
          <p className="text-sm mt-4">
            Foundations is an opinionated collection of components, patterns and
            guidelines for building consistent and accessible user interfaces.
          </p>
          <p className="text-sm">
            It&apos;s free to use under the{" "}
            <a
              className="text-foreground"
              href="https://www.gnu.org/licenses/gpl-3.0.en.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              GPL-3.0 license
            </a>
            .
          </p>
          <p className="text-sm">
            Built by{" "}
            <a className="text-foreground" href="https://significa.co">
              Significa
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
