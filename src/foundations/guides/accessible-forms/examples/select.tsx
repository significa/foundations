"use client";

import { VariantProps } from "cva";

import { cn } from "@/lib/utils";

import { inputStyle } from "./input";
import { useField } from "../field";

interface SelectProps extends React.ComponentPropsWithRef<"select"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Select = ({
  className,
  invalid: propsInvalid,
  variant,
  id,
  ...props
}: SelectProps) => {
  const fieldCtx = useField();

  const invalid =
    propsInvalid || !!fieldCtx?.["aria-errormessage"] || undefined;

  return (
    <select
      data-invalid={invalid}
      aria-invalid={invalid}
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      className={cn(
        inputStyle({ variant }),
        "appearance-none bg-[right_--spacing(2)_center] bg-[length:1em] bg-no-repeat pr-10",
        'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJibGFjayIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        'dark:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        className
      )}
      {...props}
    />
  );
};

export { Select };
