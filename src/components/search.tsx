"use client";

import { Button } from "@/foundations/ui/button/button";
import { Dialog, DialogContent, DialogTrigger } from "@/foundations/ui/dialog/dialog";
import { Input } from "@/foundations/ui/input/input";
import { PagefindSearchOptions, PagefindSearchResults } from "@/lib/pagefind-types";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useState } from "react";

const highlights = [
  {
    group: 'Introduction',
    items: [
      {
        title: 'About',
        href: '/about',
      },
      {
        title: 'Setup',
        href: '/setup',
      },
    ]
  },
  {
    group: 'UI',
    items: [
      {
        title: 'Button',
        href: '/ui/button',
      },
      {
        title: 'Dropdown',
        href: '/ui/dropdown',
      },
      {
        title: 'Input',
        href: '/ui/input',
      },
    ]
  },
  {
    group: 'Components',
    items: [
      {
        title: 'InstanceCounter',
        href: '/components/instance-counter',
      },
      {
        title: 'Slot',
        href: '/components/slot',
      },
    ]
  },
  {
    group: 'Utils',
    items: [
      {
        title: 'composeRefs',
        href: '/utils/compose-refs',
      },
      {
        title: 'debounce',
        href: '/utils/debounce',
      },
    ]
  },
  {
    group: 'Hooks',
    items: [
      {
        title: 'useIntersectionObserver',
        href: '/hooks/use-intersection-observer',
      },
      {
        title: 'useScrollLock',
        href: '/hooks/use-scroll-lock',
      },
    ]
  },
  {
    group: 'Guides',
    items: [
      {
        title: 'Accessible Forms',
        href: '/guides/accessible-form',
      },
      {
        title: 'Automated Tests',
        href: '/guides/automated-tests',
      },
    ]
  },
]

type Pagefind = {
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindSearchResults>;
  debouncedSearch: (query: string, delay: number, options?: PagefindSearchOptions) => Promise<PagefindSearchResults | null>;
};

type ResultEntry = {
  title: string;
  href: string;
}

type Result = {
  group: string,
  items: ResultEntry[]
};

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [pagefindInstance, setPagefindInstance] = useState<Pagefind | null>(null);

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

  const handleSearch = useCallback(async () => {
    if (pagefindInstance) {
      const search = await pagefindInstance.debouncedSearch(query, 300);
      if (search === null) {
        // a more recent search call has been made, do nothing
        return;
      }

      const getGroupFromHref = (href: string) => {
        const groupFromSlug = href.split('/').slice(-2)[0];
        const resultGroup = !groupFromSlug ? 'introduction' : groupFromSlug;
        const highlightMatch = highlights.find((highlight) => highlight.group.toLowerCase() === resultGroup)
    
        if (!highlightMatch) {
          return resultGroup
        }
    
        return highlightMatch.group
      }
      
      const processedResults = await Promise.all(
        search.results.map(async (result) => {
          const data = await result.data();
          const href = data.url.split('.html')[0].replace('/server/app', '')

          return {
            title: data.meta.title,
            href: href,
          };
        })
      );

      const groupedResults = processedResults.reduce((acc, result) => {
        const group = getGroupFromHref(result.href);
        const foundIndex = acc.findIndex((item) => item.group === group);

        if (foundIndex !== -1) {
          acc[foundIndex] = {
            group: group,
            items: [...acc[foundIndex].items, result]
          }
        }
        else {
          acc.push({
            group: group,
            items: [result]
          })
        }

        return acc;
      }, [] as Result[])
      
      setResults(groupedResults);
    }
  }, [pagefindInstance, query]);
  
  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        setQuery('');
        setResults([]);
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm" square variant="ghost" className="pt-0.5">
          <MagnifyingGlass />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-1/2 w-256 p-3 rounded-2xl">
        <Input 
          type="text" 
          placeholder="Search" 
          className="border-foreground-secondary rounded-lg bg-background-secondary" 
          value={query} 
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) {
              handleSearch();
            }
          }}
        />
        {query === '' ? 
          highlights.map((highlight, index) => (
            <Group key={index} result={highlight} />
          ))
         : results.map((result, index) => (
          <Group key={index} result={result} />
        ))
        }
      </DialogContent>
    </Dialog>
  );
};

type GroupProps = {
  result: Result
};

const Group = ({ result }: GroupProps) => {
  const { group, items } = result

  return (
    <div key={group} className="mt-4 px-2">
      <h3 className="text-foreground-secondary mb-2 text-sm">{group}</h3>
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <a key={index} href={item.href} className="hover:bg-background-secondary block rounded-lg px-3 py-2 text-sm">
            {item.title}
          </a>
        ))}
      </div>
    </div>
  )
}
