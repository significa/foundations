import {
  useState,
  createContext,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";

interface InstanceIndexContextType {
  getIndex: (key: string) => number;
  invalidate: () => void;
}

const InstanceIndexContext = createContext<InstanceIndexContextType>({
  getIndex: () => 0,
  invalidate: () => {},
});

interface InstanceIndexProviderProps {
  children: ReactNode;
  onChange?: (length: number) => void;
}

const InstanceIndexProvider = ({
  children,
  onChange,
}: InstanceIndexProviderProps) => {
  const keys = useRef<string[]>([]);
  const [seed, setSeed] = useState(0);

  const getIndex = useCallback(
    (key: string) => {
      if (keys.current.includes(key)) {
        return keys.current.indexOf(key);
      }

      keys.current.push(key);

      return keys.current.length - 1;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]
  );

  const invalidate = useCallback(() => {
    keys.current = [];
    setSeed((prev) => prev + 1);
  }, []);

  useEffect(() => {
    onChange?.(keys.current.length);
  }, [seed, onChange]);

  return (
    <InstanceIndexContext.Provider value={{ getIndex, invalidate }}>
      {children}
    </InstanceIndexContext.Provider>
  );
};

const useInstanceIndex = () => {
  const id = useId();
  const { getIndex, invalidate } = use(InstanceIndexContext);

  useEffect(() => {
    return () => invalidate();
  }, [invalidate, id]);

  return useMemo(() => getIndex(id), [getIndex, id]);
};

export { InstanceIndexProvider, useInstanceIndex };
