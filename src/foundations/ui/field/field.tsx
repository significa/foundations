import { createContext, use, useCallback, useEffect, useId, useMemo, useState } from "react";
import { Slot } from "@/foundations/components/slot/slot";
import { cn } from "@/lib/utils/classnames";

interface FieldContextValue {
  controlId: string;
  labelId: string;
  describedBy: string | undefined;
  invalid: boolean | undefined;
  registerMessage: (id: string) => () => void;
}

const FieldContext = createContext<FieldContextValue | null>(null);

const useFieldContext = () => {
  const ctx = use(FieldContext);
  if (!ctx) {
    throw new Error("Field components must be used within a <Field />");
  }
  return ctx;
};

interface FieldProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * Marks the wrapped control as invalid. Wire this to your validation source
   * (RHF, Zod, server response, plain useState — Field doesn't care).
   */
  invalid?: boolean;
}

const Field = ({ invalid, className, children, ...props }: FieldProps) => {
  const controlId = useId();
  const labelId = useId();
  const [messageIds, setMessageIds] = useState<string[]>([]);

  const registerMessage = useCallback((id: string) => {
    setMessageIds((prev) => [...prev, id]);
    return () => {
      setMessageIds((prev) => prev.filter((existing) => existing !== id));
    };
  }, []);

  const describedBy = messageIds.length > 0 ? messageIds.join(" ") : undefined;

  const ctx = useMemo<FieldContextValue>(
    () => ({ controlId, labelId, describedBy, invalid, registerMessage }),
    [controlId, labelId, describedBy, invalid, registerMessage],
  );

  return (
    <FieldContext value={ctx}>
      <div
        className={cn("flex flex-col gap-1.5", className)}
        data-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </div>
    </FieldContext>
  );
};

const FieldLabel = ({ className, ...props }: React.ComponentPropsWithRef<"label">) => {
  const { controlId, labelId } = useFieldContext();
  return (
    <label
      htmlFor={controlId}
      id={labelId}
      className={cn("font-medium text-base text-foreground", className)}
      {...props}
    />
  );
};

interface FieldControlProps {
  children: React.ReactNode;
}

const FieldControl = ({ children }: FieldControlProps) => {
  const { controlId, labelId, describedBy, invalid } = useFieldContext();
  return (
    <Slot
      id={controlId}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
    >
      {children}
    </Slot>
  );
};

const FieldDescription = ({ className, children, ...props }: React.ComponentPropsWithRef<"p">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const { registerMessage } = useFieldContext();
  const hasContent = !!children;

  useEffect(() => {
    if (!hasContent) return;
    return registerMessage(id);
  }, [id, hasContent, registerMessage]);

  if (!hasContent) return null;

  return (
    <p id={id} className={cn("text-foreground-secondary text-sm", className)} {...props}>
      {children}
    </p>
  );
};

const FieldError = ({ className, children, ...props }: React.ComponentPropsWithRef<"p">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const { registerMessage } = useFieldContext();
  const hasContent = !!children;

  useEffect(() => {
    if (!hasContent) return;
    return registerMessage(id);
  }, [id, hasContent, registerMessage]);

  if (!hasContent) return null;

  return (
    <p id={id} role="alert" className={cn("text-error text-sm", className)} {...props}>
      {children}
    </p>
  );
};

const CompoundField = Object.assign(Field, {
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});

export { CompoundField as Field };
