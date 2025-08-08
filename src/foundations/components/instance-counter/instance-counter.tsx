"use client";

import {
  createContext,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

interface InstanceCounterContextType {
  getIndex: (key: string) => number;
  invalidate: () => void;
}

const InstanceCounterContext = createContext<InstanceCounterContextType>({
  getIndex: () => 0,
  invalidate: () => {},
});

interface InstanceCounterProviderProps {
  children: ReactNode;
  onChange?: (length: number) => void;
}

const InstanceCounterProvider = ({
  children,
  onChange,
}: InstanceCounterProviderProps) => {
  const [seed, setSeed] = useState(0);

  const keys = useRef<string[]>([]);
  const isMounted = useRef(false);

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
    if (isMounted.current) {
      keys.current = [];
      setSeed((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    onChange?.(keys.current.length);
  }, [seed, onChange]);

  return (
    <InstanceCounterContext value={{ getIndex, invalidate }}>
      {children}
    </InstanceCounterContext>
  );
};

const useInstanceCounter = () => {
  const id = useId();
  const context = use(InstanceCounterContext);

  if (!context) {
    throw new Error(
      "useInstanceCounter must be used within an InstanceCounterProvider"
    );
  }

  const { getIndex, invalidate } = context;

  useEffect(() => {
    invalidate();
    return () => invalidate();
  }, [invalidate, id]);

  return useMemo(() => getIndex(id), [getIndex, id]);
};

export { InstanceCounterProvider, useInstanceCounter };
