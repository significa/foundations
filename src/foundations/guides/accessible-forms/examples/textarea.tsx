"use client";

import { VariantProps } from "cva";

import { cn } from "@/lib/utils";

import { useField } from "../field";
import { inputStyle } from "./input";

interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Textarea = ({
  className,
  invalid: propsInvalid,
  variant,
  id,
  ...props
}: TextareaProps) => {
  const fieldCtx = useField();

  const invalid =
    propsInvalid || !!fieldCtx?.["aria-errormessage"] || undefined;

  return (
    <textarea
      data-invalid={invalid}
      aria-invalid={invalid}
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      className={cn(
        inputStyle({ variant }),
        "h-auto resize-none py-2 leading-snug",
        className
      )}
      {...props}
    />
  );
};

export { Textarea };
