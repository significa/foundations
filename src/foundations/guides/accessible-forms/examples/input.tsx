"use client";

import { VariantProps } from "cva";

import { cn,cva } from "@/lib/utils";

import { useField } from "../field";

const inputStyle = cva({
  base: [
    "transition",
    "w-full border h-10 rounded-xl px-4 py-1 text-base font-medium",
    "focus:outline-none focus-visible:border-foreground/20 focus-visible:ring-4 focus-visible:ring-ring focus-visible:text-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground/80 placeholder:text-foreground-secondary data-invalid:border-red-500 data-invalid:hover:border-red-600 data-invalid:focus-visible:border-red-500 data-invalid:focus-visible:ring-red-500/20",
  ],
  variants: {
    variant: {
      default: "border-border bg-background hover:border-border-hard shadow-xs",
      minimal:
        "border-transparent bg-transparent hover:bg-background-secondary focus-visible:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps
  extends Omit<React.ComponentPropsWithRef<"input">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Input = ({
  className,
  invalid: propsInvalid,
  variant,
  id,
  ...props
}: InputProps) => {
  const fieldCtx = useField();

  const invalid =
    propsInvalid || !!fieldCtx?.["aria-errormessage"] || undefined;

  return (
    <input
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        props.type === "number" && [
          "[&::-webkit-inner-spin-button]:hidden",
          "[&::-webkit-outer-spin-button]:hidden",
          "[appearance:textfield]",
        ],
        className
      )}
      {...props}
    />
  );
};

export { Input, inputStyle };
