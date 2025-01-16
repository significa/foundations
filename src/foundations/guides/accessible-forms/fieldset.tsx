"use client";

import {
  createContext,
  useCallback,
  useEffect,
  use,
  useId,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface FieldsetContextValue {
  registerLegendElement: (id: string) => () => void;
}

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

const useFieldset = () => use(FieldsetContext);

const Fieldset = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"fieldset">) => {
  const [legendIds, setLegendIds] = useState<string[]>([]);

  const registerLegendElement = useCallback((id: string) => {
    setLegendIds((prev) => [...prev, id]);

    const unregister = () => {
      setLegendIds((prev) => prev.filter((prevId) => prevId !== id));
    };

    return unregister;
  }, []);

  const ctx = useMemo(
    () => ({
      registerLegendElement,
    }),
    [registerLegendElement]
  );

  return (
    <FieldsetContext value={ctx}>
      <fieldset
        aria-labelledby={legendIds.length > 0 ? legendIds.join(" ") : undefined}
        className={cn(
          "border-border space-y-6 not-first:border-t not-first:pt-6",
          className
        )}
        {...props}
      >
        {children}
      </fieldset>
    </FieldsetContext>
  );
};

const Legend = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"legend">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const ctx = useFieldset();

  useEffect(() => {
    if (!ctx?.registerLegendElement) return;

    const unregister = ctx?.registerLegendElement(id);

    return unregister;
  }, [ctx, id]);

  return (
    <div
      id={id}
      className={cn("text-foreground text-base font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Fieldset, Legend };
