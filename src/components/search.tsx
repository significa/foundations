"use client";

import { Button } from "@/foundations/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/foundations/ui/dialog/dialog";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import { navigation } from "@/lib/navigation";
import {
  PagefindSearchOptions,
  PagefindSearchResults,
} from "@/lib/pagefind-types";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

const highlights = [
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

type Pagefind = {
  search: (
    query: string,
    options?: PagefindSearchOptions
  ) => Promise<PagefindSearchResults>;
  debouncedSearch: (
    query: string,
    delay: number,
    options?: PagefindSearchOptions
  ) => Promise<PagefindSearchResults | null>;
};

type ResultEntry = {
  title: string;
  href: string;
};

type Result = {
  group: string;
  items: ResultEntry[];
};

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [pagefindInstance, setPagefindInstance] = useState<Pagefind | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadPagefind = async () => {
      if (!pagefindInstance) {
        try {
          const instance = await import(
            // @ts-expect-error pagefind.js generated after build
            /* webpackIgnore: true */ "/pagefind/pagefind.js"
          );
          setPagefindInstance(instance);
        } catch (e) {
          console.error(e);
          console.warn(
            "[Pagefind]: Run 'npm run build' to index the site. Check the README for more information."
          );
        }
      }
    };
    loadPagefind();
  }, [pagefindInstance]);

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

  useEffect(() => {
    const handleSearch = async () => {
      if (pagefindInstance) {
        const search = await pagefindInstance.debouncedSearch(query, 200);
        if (search === null) {
          // a more recent search call has been made, do nothing
          return;
        }

        const findGroupByHref = (href: string) => {
          const navigationItem = navigation.find((item) =>
            item.children.some((child) => child.href === href)
          );
          return navigationItem?.title;
        };

        // Process each search result into an object consisting of its title and href
        const processedResults = await Promise.all(
          search.results.map(async (result) => {
            const data = await result.data();

            // Array of marked words from each result's excerpt
            const markedWords = [
              ...(data.excerpt.matchAll(/<mark>(.*?)<\/mark>/g) || []),
            ].map((match) => match[1]);

            // A result is skipped if no marked words match the query, this way we don't get "similar query" results
            if (
              !markedWords.some((word) =>
                word.toLowerCase().includes(query.toLowerCase())
              )
            ) {
              return;
            }

            const href = data.url.split(".html")[0].replace("/server/app", "");

            return {
              title: data.meta.title,
              href: href,
            };
          })
        );

        const groupedResults = processedResults.reduce((acc, result) => {
          if (!result) {
            return acc;
          }

          const group = findGroupByHref(result.href) ?? "";

          if (group === "") {
            return acc;
          }

          const foundIndex = acc.findIndex((item) => item.group === group);

          // Max number of items in each group
          if (foundIndex !== -1 && acc[foundIndex].items.length >= 15) {
            return acc;
          }

          if (foundIndex !== -1) {
            acc[foundIndex] = {
              group: group,
              items: [...acc[foundIndex].items, result],
            };
          } else {
            acc.push({
              group: group,
              items: [result],
            });
          }

          return acc;
        }, [] as Result[]);

        setResults(groupedResults);
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [pagefindInstance, query]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setQuery("");
          setResults([]);
        }
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button size="sm" square variant="ghost" className="pt-px">
          <MagnifyingGlassIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[400px] max-h-[70svh] w-5xl flex-col rounded-xl p-0">
        <div
          className={cn(
            "border-border bg-background sticky top-0 z-10 flex w-full items-center border-b px-3.5 py-3",
            !pagefindInstance && "pointer-events-none opacity-50"
          )}
        >
          {isLoading ? (
            <span className="mt-0.5 flex items-center">
              <Spinner className="size-3.5" />
            </span>
          ) : (
            <MagnifyingGlassIcon className="mt-0.5 size-3.5" />
          )}
          <input
            type="text"
            className="ml-2.5 outline-none"
            placeholder="Search"
            autoFocus
            value={query}
            onChange={(e) => {
              if (!isLoading) setIsLoading(true);
              setQuery(e.target.value);
            }}
            disabled={!pagefindInstance}
          />
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto pt-4 pb-1">
          {!pagefindInstance ? (
            <div className="text-foreground-secondary flex items-center justify-center px-3.5 text-sm">
              Could not load Pagefind instance.
            </div>
          ) : (
            <>
              {(query === "" || (results.length === 0 && isLoading)) &&
                highlights.map((highlight, index) => (
                  <Group key={index} result={highlight} />
                ))}
              {(results.length > 0 || (results.length > 0 && isLoading)) &&
                results.map((result, index) => (
                  <Group key={index} result={result} />
                ))}
              {!isLoading && results.length === 0 && query !== "" && (
                <div className="text-foreground-secondary flex items-center px-3.5 text-sm">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type GroupProps = {
  result: Result;
};

const Group = ({ result }: GroupProps) => {
  const { group, items } = result;

  return (
    <div key={group} className="px-1">
      <div className="px-2.5">
        <h3 className="text-foreground-secondary mb-1 pb-1.5 text-xs">
          {group}
        </h3>
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="hover:bg-background-secondary block rounded-lg px-2.5 py-1.5 text-sm"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
};
