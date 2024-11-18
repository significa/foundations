import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/foundations/hooks/useIntersectionObserver';

function fetchMockData() {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve('Hello World!'), 1000);
  });
}

export function UseIntersectionObserverLazy() {
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isIntersecting } = useIntersectionObserver(ref, { threshold: 1 });

  useEffect(() => {
    if (isIntersecting && !data) {
      const loadData = async () => {
        setIsLoading(true);

        try {
          const fetchedData = await fetchMockData();
          setData(fetchedData);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [data, isIntersecting]);

  return (
    <div ref={ref} className="px-6 py-4 bg-foreground/5 rounded-md">
      <h2 className="text-md mb-2 font-bold">Lazy Data Fetching</h2>
      {!isLoading && !data && <p>Waiting for intersection to fetch data...</p>}
      {isLoading && <p>Fetching...</p>}
      {!isLoading && data && <p>{data}</p>}
    </div>
  );
}
