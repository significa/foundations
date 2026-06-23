import { MagnifyingGlassIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useState } from "react";
import { useKeyboardShortcut } from "@/foundations/hooks/use-keyboard-shortcut/use-keyboard-shortcut";
import { IconButton } from "@/foundations/ui/button/button";
import { Dialog } from "@/foundations/ui/dialog/dialog";
import { Menu } from "@/foundations/ui/menu/menu";
import type { Pagefind } from "@/lib/types/pagefind";

const MAX_ITEMS_PER_GROUP = 7;

const HIGHLIGHTS: Result[] = [
  {
    group: "Introduction",
    items: [
      { title: "About", href: "/about" },
      { title: "Setup", href: "/setup" },
    ],
  },
  {
    group: "UI",
    items: [
      { title: "Button", href: "/ui/button" },
      { title: "Menu", href: "/ui/menu" },
      { title: "Input", href: "/ui/input" },
    ],
  },
  {
    group: "Components",
    items: [
      { title: "InstanceCounter", href: "/components/instance-counter" },
      { title: "Slot", href: "/components/slot" },
    ],
  },
  {
    group: "Hooks",
    items: [
      {
        title: "useIntersectionObserver",
        href: "/hooks/use-intersection-observer",
      },
      { title: "useScrollLock", href: "/hooks/use-scroll-lock" },
    ],
  },
  {
    group: "Guides",
    items: [
      { title: "Accessible Forms", href: "/guides/accessible-form" },
      { title: "Automated Tests", href: "/guides/automated-tests" },
    ],
  },
];

type Item = { title: string; href: string };
type Result = { group: string; items: Item[] };

const Search = () => {
  const [pagefind, isPagefindError] = usePagefind();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>(HIGHLIGHTS);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!pagefind) return;

      const search = await pagefind.debouncedSearch(query);

      // a more recent search call has been made, do nothing
      if (!search) return;

      const matches = await Promise.all(
        search.results.map(async (result) => {
          const data = await result.data();

          return {
            title: data.meta.title ?? "",
            folder: data.meta.folder,
            href: data.url.replace(".html", ""),
          };
        }),
      );

      const groupedMatches = matches.reduce((acc, result) => {
        const group = result.folder || "other";
        const existing = acc.find((item) => item.group === group);

        if (existing) {
          existing.items.push(result);
        } else {
          acc.push({ group, items: [result] });
        }

        return acc;
      }, [] as Result[]);

      setResults(groupedMatches);
    },
    [pagefind],
  );

  useEffect(() => {
    if (query === "") {
      setResults(HIGHLIGHTS);
      return;
    }

    void handleSearch(query);
  }, [query, handleSearch]);

  useKeyboardShortcut({ key: "k", mod: true }, () => setIsOpen(true));

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next);
    if (!next) {
      setQuery("");
      setResults(HIGHLIGHTS);
    }
  };

  const handleSelect = (href: string) => {
    setIsOpen(false);
    window.location.href = href;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <IconButton size="sm" variant="ghost" aria-label="Search" className="pt-px">
          <MagnifyingGlassIcon />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content
        catchFocus={false}
        className="flex h-100 max-h-[70svh] w-full max-w-xl flex-col rounded-xl p-0"
      >
        <Menu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
          <Menu.Trigger className="hidden" />
          <Menu.Items inline className="flex h-full flex-col overflow-hidden">
            <Menu.SearchInput
              autoFocus
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex-1 scroll-py-(--inset) overflow-y-auto py-(--inset)">
              {isPagefindError ? (
                <PagefindError />
              ) : (
                <>
                  {results.map((result) => {
                    const items = result.items.slice(0, MAX_ITEMS_PER_GROUP);
                    if (items.length === 0) return null;

                    return (
                      <Menu.Section key={result.group}>
                        <Menu.Heading className="capitalize">{result.group}</Menu.Heading>
                        {items.map((item) => (
                          <Menu.Item key={item.href} onSelect={() => handleSelect(item.href)}>
                            {item.title}
                          </Menu.Item>
                        ))}
                      </Menu.Section>
                    );
                  })}
                  {!!query && results.every((g) => g.items.length === 0) && (
                    <Menu.Empty>
                      <WarningCircleIcon className="mr-1 inline-block align-text-bottom" />
                      No results found.
                    </Menu.Empty>
                  )}
                </>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </Dialog.Content>
    </Dialog>
  );
};

const PagefindError = () => (
  <div className="text-foreground-secondary">
    <div className="flex items-center justify-center gap-1 p-3.5 text-foreground-secondary text-sm">
      <WarningCircleIcon />
      Could not load Pagefind instance.
    </div>
    {import.meta.env.DEV && (
      <div className="mt-4 space-y-1 text-balance text-center text-xs">
        <p>Generate a development Pagefind instance by running</p>
        <code className="mx-1 rounded-sm border bg-foreground/4 px-1 py-0.5 font-[0.95rem] leading-loose">
          pnpm dev:pagefind
        </code>
      </div>
    )}
  </div>
);

const usePagefind = () => {
  const [instance, setInstance] = useState<Pagefind | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPagefind = async () => {
      try {
        // @ts-expect-error - dynamic import not typed
        const pagefind = await import("/pagefind/pagefind.js");
        setInstance(pagefind);
      } catch (e) {
        console.error("Failed to load Pagefind instance:", e);
        setIsError(true);
      }
    };

    void loadPagefind();
  }, []);

  return [instance, isError] as const;
};

export { Search };
