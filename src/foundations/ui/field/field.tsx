"use client";

import {
  createContext,
  Fragment,
  useCallback,
  use,
  useId,
  useMemo,
  useState,
} from "react";

interface FieldContextType {
  id: string;
  "aria-errormessage"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  registerElement: (
    type: "error" | "description" | "label",
    id: string
  ) => () => void;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined);

const useField = () => use(FieldContext);

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Field = ({ children, className, ...props }: FieldProps) => {
  const id = useId();

  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);
  const [labelIds, setLabelIds] = useState<string[]>([]);

  const registerErrorElement = useCallback((id: string) => {
    setErrorIds((prev) => [...prev, id]);

    const unregister = () => {
      setErrorIds((prev) => prev.filter((prevId) => prevId !== id));
    };

    return unregister;
  }, []);

  const registerDescriptionElement = useCallback((id: string) => {
    setDescriptionIds((prev) => [...prev, id]);

    const unregister = () => {
      setDescriptionIds((prev) => prev.filter((prevId) => prevId !== id));
    };

    return unregister;
  }, []);

  const registerLabelElement = useCallback((id: string) => {
    setLabelIds((prev) => [...prev, id]);

    const unregister = () => {
      setLabelIds((prev) => prev.filter((prevId) => prevId !== id));
    };

    return unregister;
  }, []);

  const registerElement = useCallback(
    (type: "error" | "description" | "label", id: string) => {
      switch (type) {
        case "error":
          return registerErrorElement(id);
        case "description":
          return registerDescriptionElement(id);
        case "label":
          return registerLabelElement(id);
      }
    },
    [registerErrorElement, registerDescriptionElement, registerLabelElement]
  );

  const ariaErrormessage = useMemo(() => {
    return errorIds.length > 0 ? errorIds.join(" ") : undefined;
  }, [errorIds]);

  const ariaDescribedby = useMemo(() => {
    return descriptionIds.length > 0 ? descriptionIds.join(" ") : undefined;
  }, [descriptionIds]);

  const ariaLabelledby = useMemo(() => {
    return labelIds.length > 0 ? labelIds.join(" ") : undefined;
  }, [labelIds]);

  const ctx = useMemo(
    () => ({
      registerElement,
      id,
      "aria-errormessage": ariaErrormessage,
      "aria-describedby": ariaDescribedby,
      "aria-labelledby": ariaLabelledby,
    }),
    [registerElement, id, ariaErrormessage, ariaDescribedby, ariaLabelledby]
  );

  const hasOnlyChildren =
    Object.keys(props).length === 1 && "children" in props;
  const Comp = hasOnlyChildren ? Fragment : "div";

  return (
    <FieldContext value={ctx}>
      <Comp className={className} {...props}>
        {children}
      </Comp>
    </FieldContext>
  );
};

export { Field, useField };
