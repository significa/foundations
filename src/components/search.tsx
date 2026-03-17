import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/foundations/ui/button/button";
import { Dialog, DialogContent, DialogTrigger } from "@/foundations/ui/dialog/dialog";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import type { Pagefind } from "@/lib/types/pagefind";
import { cn } from "@/lib/utils/classnames";
import { WarningCircleIcon } from "@phosphor-icons/react";

const MAX_ITEMS_PER_GROUP = 7;

const HIGHLIGHTS: Result[] = [
  {
    group: "Introduction",
    items: [
      {
        title: "About",
        href: "/about",
      },
      {
        title: "Setup",
        href: "/setup",
      },
    ],
  },
  {
    group: "UI",
    items: [
      {
        title: "Button",
        href: "/ui/button",
      },
      {
        title: "Dropdown",
        href: "/ui/dropdown",
      },
      {
        title: "Input",
        href: "/ui/input",
      },
    ],
  },
  {
    group: "Components",
    items: [
      {
        title: "InstanceCounter",
        href: "/components/instance-counter",
      },
      {
        title: "Slot",
        href: "/components/slot",
      },
    ],
  },
  {
    group: "Hooks",
    items: [
      {
        title: "useIntersectionObserver",
        href: "/hooks/use-intersection-observer",
      },
      {
        title: "useScrollLock",
        href: "/hooks/use-scroll-lock",
      },
    ],
  },
  {
    group: "Guides",
    items: [
      {
        title: "Accessible Forms",
        href: "/guides/accessible-form",
      },
      {
        title: "Automated Tests",
        href: "/guides/automated-tests",
      },
    ],
  },
];

type Result = {
  group: string;
  items: { title: string; href: string }[];
};

const Search = () => {
  const [pagefind, isPagefindError] = usePagefind();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>(HIGHLIGHTS);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!pagefind) return null;
      setIsLoading(true);

      const search = await pagefind.debouncedSearch(query);

      // a more recent search call has been made, do nothing
      if (!search) return;

      const matches = await Promise.all(
        search.results.map(async (result) => {
          const data = await result.data();

          return {
            title: data.meta.title,
            folder: data.meta.folder,
            href: data.url.replace(".html", ""),
          };
        })
      );

      const groupedMatches = matches.reduce((acc, result) => {
        const group = result.folder || "other";
        const existingGroupIndex = acc.findIndex((item) => item.group === group);

        if (existingGroupIndex !== -1) {
          acc[existingGroupIndex] = {
            group: group,
            items: [...acc[existingGroupIndex].items, result],
          };

          return acc;
        } else {
          return [
            ...acc,
            {
              group: group,
              items: [result],
            },
          ];
        }
      }, [] as Result[]);

      setResults(groupedMatches);
      setIsLoading(false);
    },
    [pagefind]
  );

  // Perform search whenever the query changes
  useEffect(() => {
    if (query === "") {
      setResults(HIGHLIGHTS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    handleSearch(query);
  }, [query, handleSearch]);

  // Listen for Cmd+K or Ctrl+K to open the search dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setQuery("");
        setResults(HIGHLIGHTS);
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" square variant="ghost" className="pt-px">
          <MagnifyingGlassIcon />
        </Button>
      </DialogTrigger>

      <DialogContent catchFocus={false} className="flex h-100 max-h-[70svh] flex-col rounded-xl p-0">
        <div className={cn("border-border bg-background sticky top-0 z-10 flex w-full items-center border-b px-3.5 py-3")}>
          <div className="flex size-4 items-center justify-center overflow-hidden">
            {isLoading ? <Spinner className="size-3" /> : <MagnifyingGlassIcon className="mt-0.5 size-4" />}
          </div>
          <input
            type="text"
            className="ml-2.5 w-full outline-none"
            placeholder="Search..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto p-2 pt-4 pb-1">
          {isPagefindError ? (
            <div className="text-foreground-secondary">
              <div className="text-foreground-secondary flex items-center justify-center gap-1 p-3.5 text-sm">
                <WarningCircleIcon />
                Could not load Pagefind instance.
              </div>
              {import.meta.env.DEV && (
                <div className="mt-4 space-y-1 text-center text-xs text-balance">
                  <p>Generate a development Pagefind instance by running</p>
                  <code className="bg-foreground/4 mx-1 rounded-sm border px-1 py-0.5 leading-[2] font-[0.95rem]">
                    pnpm dev:pagefind
                  </code>
                </div>
              )}
            </div>
          ) : (
            <>
              {results.map((result) => {
                const clampedResults = [...result.items].splice(0, MAX_ITEMS_PER_GROUP);
                if (clampedResults.length === 0) return null;

                return (
                  <div key={result.group}>
                    <h2 className="text-foreground-secondary mb-2 px-2.5 text-xs capitalize">{result.group}</h2>
                    <div className="flex flex-col gap-0.5">
                      {clampedResults.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="hover:bg-background-secondary ring-ring block rounded-lg px-2.5 py-1.5 text-sm focus-visible:ring-4 focus-visible:outline-none"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
              {!!query && !isLoading && results.length === 0 && (
                <div className="text-foreground-secondary flex h-full items-center justify-center gap-1 p-3.5 text-sm">
                  <WarningCircleIcon />
                  No results found.
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const usePagefind = () => {
  const [instance, setInstance] = useState<Pagefind | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPagefind = async () => {
      try {
        // use eval to circumvent vite and use native dynamic module import
        await eval(`import("/pagefind/pagefind.js")`).then((mod) => {
          setInstance(mod);
        });
      } catch (e) {
        console.error("Failed to load Pagefind instance:", e);
        setIsError(true);
      }
    };

    loadPagefind();
  }, []);

  return [instance, isError] as const;
};

export { Search };
