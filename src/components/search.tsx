"use client";

import { Button } from "@/foundations/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/foundations/ui/dialog/dialog";
import { Input, InputGroup, InputPrefix } from "@/foundations/ui/input/input";
import { navigation } from "@/lib/navigation";
import {
  PagefindSearchOptions,
  PagefindSearchResults,
} from "@/lib/pagefind-types";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

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

      const processedResults = await Promise.all(
        search.results.map(async (result) => {
          const data = await result.data();
          const href = data.url.split(".html")[0].replace("/server/app", "");

          return {
            title: data.meta.title,
            href: href,
          };
        })
      );

      const groupedResults = processedResults.reduce((acc, result) => {
        const group = findGroupByHref(result.href) ?? "";

        if (group === "") {
          return acc;
        }

        const foundIndex = acc.findIndex((item) => item.group === group);

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
  }, [pagefindInstance, query]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setQuery("");
          setResults([]);
          triggerRef.current?.blur();
        }
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          square
          variant="ghost"
          className="pt-px"
          ref={triggerRef}
        >
          <MagnifyingGlass />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-1/2 w-256 rounded-2xl p-3">
        <InputGroup>
          <InputPrefix>
            <MagnifyingGlass />
          </InputPrefix>
          <Input
            type="text"
            placeholder="Search"
            className="border-foreground-secondary bg-background-secondary rounded-lg"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) {
                handleSearch();
              }
            }}
          />
        </InputGroup>
        {query === "" || isLoading ? (
          highlights.map((highlight, index) => (
            <Group key={index} result={highlight} />
          ))
        ) : results.length > 0 ? (
          results.map((result, index) => <Group key={index} result={result} />)
        ) : (
          <div className="text-foreground-secondary flex h-32 items-center justify-center text-sm">
            No results found
          </div>
        )}
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
    <div key={group} className="mt-4 px-2">
      <h3 className="text-foreground-secondary mb-2 text-sm">{group}</h3>
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="hover:bg-background-secondary block rounded-lg px-3 py-2 text-sm"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
};
