"use client";

import { VariantProps } from "cva";

import { cn, cva } from "@/lib/utils/classnames";

import { useField } from "../field";

const inputStyle = cva({
  base: [
    "transition",
    "h-10 w-full rounded-xl border px-4 py-1 text-base font-medium",
    "focus-visible:border-foreground/20 focus-visible:ring-ring focus-visible:text-foreground text-foreground/80 placeholder:text-foreground-secondary focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-red-500 data-invalid:hover:border-red-600 data-invalid:focus-visible:border-red-500 data-invalid:focus-visible:ring-red-500/20",
  ],
  variants: {
    variant: {
      default: "border-border bg-background hover:border-border-hard shadow-xs",
      minimal: "hover:bg-background-secondary focus-visible:bg-background border-transparent bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps extends Omit<React.ComponentPropsWithRef<"input">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Input = ({ className, invalid: propsInvalid, variant, id, ...props }: InputProps) => {
  const fieldCtx = useField();

  const invalid = propsInvalid || !!fieldCtx?.["aria-errormessage"] || undefined;

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
