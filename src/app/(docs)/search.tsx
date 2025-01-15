'use client';

import { useState, useEffect } from "react";

import type { PagefindSearchOptions, PagefindSearchResult, PagefindSearchResults } from '@/lib/pagefind-types';

type Pagefind = {
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindSearchResults>;
  debouncedSearch: (query: string, delay: number, options?: PagefindSearchOptions) => Promise<PagefindSearchResults | null>;
};

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindSearchResult[]>([]);
  const [pagefindInstance, setPagefindInstance] = useState<Pagefind | null>(null);

  useEffect(() => {
    const loadPagefind = async () => {
      if (!pagefindInstance) {
        try {
          const instance = await import(
            // @ts-expect-error pagefind.js generated after build
            "/pagefind/pagefind.js"
          );
          setPagefindInstance(instance);
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadPagefind();
  }, [pagefindInstance]);

  async function handleSearch() {
    if (pagefindInstance) {
      const search = await pagefindInstance.debouncedSearch(query, 300);
      if (search === null) {
        // a more recent search call has been made, do nothing
      } else {
        setResults(search.results);
      }
    }
  }

  useEffect(() => {
    const getResults = async () => {
      for (const result of results) {
        const data = await result.data();
        console.log(`${data.meta.title}`, data.sub_results);      
      }
    }

    getResults();

  }, [results]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onInput={handleSearch}
      />
    </div>
  );
}