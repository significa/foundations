"use client";

import { VariantProps } from "cva";
import { Slot, Slottable } from "@radix-ui/react-slot";

import { cn, cva } from "@/lib/utils";

import { Spinner } from "@/foundations/ui/spinner/spinner";

const buttonStyle = cva({
  base: "shrink-0 relative whitespace-nowrap inline-flex items-center justify-center gap-1.5 font-medium shadow-xs transition focus-visible:outline-none focus-visible:ring-4 disabled:opacity-40 enabled:cursor-pointer h-(--button-height) ring-ring active:scale-98",
  variants: {
    variant: {
      primary: "bg-foreground text-background",
      destructive: "bg-red-600 text-white ring-red-600/50 hover:bg-red-700",
      outline: "border border-border bg-background",
      ghost:
        "border-none bg-transparent ring-0 shadow-none hover:bg-foreground/5",
    },
    size: {
      xs: "rounded-lg px-2 text-sm [--button-height:theme(spacing.6)]",
      sm: "rounded-lg px-3 text-sm [--button-height:theme(spacing.8)]",
      md: "rounded-xl px-4 text-base [--button-height:theme(spacing.10)]",
      lg: "rounded-2xl px-5 text-base [--button-height:theme(spacing.12)]",
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
        isLoading && "text-transparent"
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Slottable>{children}</Slottable>
      {isLoading && (
        <span
          data-button-spinner
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            buttonStyle({ className, variant })
              .split(" ")
              .filter((cl) => cl.startsWith("text-")) ?? "text-current"
          )}
        >
          <Spinner size={size} />
        </span>
      )}
    </Comp>
  );
};

export { Button, buttonStyle };
