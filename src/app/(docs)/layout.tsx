import { Header } from "./header";
import { Footer } from "./footer";
import { getNavigationWithDates } from "@/lib/utils/navigation";
import { Menu } from "@/components/menu";
import { cn } from "@/lib/utils";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="mx-auto flex max-w-(--breakpoint-2xl)">
        <aside
          id="app-menu"
          // controlled by button by ./header.tsx component
          data-mobile-menu-open="false"
          data-pagefind-ignore="all"
          className={cn(
            "bg-background shrink-0 overflow-y-auto overscroll-contain px-2 pt-2 pb-12 md:px-4 xl:px-2",
            "fixed top-12 mt-px hidden h-[calc(100dvh-var(--spacing)*12)] w-full data-[mobile-menu-open=true]:block max-xl:z-200",
            "md:top-14 md:h-[calc(100dvh-var(--spacing)*14)] xl:sticky xl:block xl:max-w-[250px] xl:border-r xl:pt-4"
          )}
        >
          <Menu items={await getNavigationWithDates()} />
        </aside>
        <main className="w-full gap-8 px-4 lg:flex">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
