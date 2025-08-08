"use client";

import { VariantProps } from "cva";

import { Slot, Slottable } from "@/foundations/components/slot/slot";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import { cn, cva } from "@/lib/utils";

const buttonStyle = cva({
  base: "shrink-0 relative whitespace-nowrap inline-flex items-center justify-center gap-1.5 font-medium shadow-xs transition focus-visible:outline-none focus-visible:ring-4 disabled:opacity-40 enabled:cursor-pointer h-(--button-height) ring-ring active:scale-98 text-(--button-text-color) [--button-text-color:var(--color-foreground)]",
  variants: {
    variant: {
      primary: "bg-accent [--button-text-color:var(--color-accent-foreground)]",
      outline: "border border-border bg-background focus-visible:border-accent",
      ghost:
        "border-none bg-transparent ring-0 shadow-none hover:bg-foreground/5",
      destructive:
        "bg-red-600 [--button-text-color:var(--color-white)] ring-red-600/50 hover:bg-red-700",
    },
    size: {
      xs: "rounded-lg px-2 text-sm [--button-height:--spacing(6)]",
      sm: "rounded-lg px-3 text-sm [--button-height:--spacing(8)]",
      md: "rounded-xl px-4 text-base [--button-height:--spacing(10)]",
      lg: "rounded-2xl px-5 text-base [--button-height:--spacing(12)]",
    },
    square: {
      true: "w-(--button-height) px-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithRef<"button">,
    VariantProps<typeof buttonStyle> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  variant,
  asChild = false,
  isLoading,
  size = "md",
  square,
  type = "button",
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonStyle({
          className,
          variant,
          size,
          square,
        }),
        isLoading && "text-transparent transition-none"
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Slottable asChild={asChild} child={children}>
        {(child) => (
          <>
            {child}
            {isLoading && (
              <span
                data-button-spinner
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "text-(--button-text-color)"
                )}
              >
                <Spinner size={size} />
              </span>
            )}
          </>
        )}
      </Slottable>
    </Comp>
  );
};

export { Button, buttonStyle };
