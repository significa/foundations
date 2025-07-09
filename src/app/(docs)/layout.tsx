import { Header } from "./header";
import { Footer } from "./footer";
import { getNavigationWithDates } from "@/lib/utils/navigation-utils";
import { Menu } from "@/components/menu";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="mx-auto flex max-w-screen-2xl">
        <aside 
          className="sticky top-14 hidden h-[calc(100dvh-var(--spacing)*14)] w-[250px] shrink-0 overflow-y-auto border-r px-1 pt-6 md:px-2 xl:block" 
          data-pagefind-ignore="all"
        >
            <Menu items={await getNavigationWithDates()} />
        </aside>
        <main className="w-full gap-8 px-2 md:px-4 lg:flex">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
