"use client";

import { VariantProps } from "cva";

import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputPrefix,
  inputStyle,
} from "@/foundations/ui/input/input";

interface SelectProps extends React.ComponentPropsWithRef<"select"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Select = ({ className, invalid, variant, ...props }: SelectProps) => {
  return (
    <select
      data-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        "appearance-none bg-[length:1em] bg-[right_calc(var(--spacing)*2)_center] bg-no-repeat pr-10",
        'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJibGFjayIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        'dark:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        className
      )}
      {...props}
    />
  );
};

const SelectGroup = InputGroup;

const SelectPrefix = InputPrefix;

export { Select, SelectGroup, SelectPrefix };
