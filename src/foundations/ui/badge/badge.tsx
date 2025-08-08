"use client";

import type { VariantProps } from "cva";

import { Slot } from "@/foundations/components/slot/slot";
import { cn, cva } from "@/lib/utils";

const badgeVariants = cva({
  base: "inline-flex items-center gap-1 rounded-full font-semibold leading-none ring-1 ring-inset [&>[data-badge-icon]:first-child]:-ml-0.5 [&>[data-badge-icon]:last-child]:-mr-0.5",
  variants: {
    variant: {
      neutral: "bg-background text-foreground/80 ring-foreground/10",
      success: "bg-emerald-500/10 text-emerald-600 ring-emerald-600/20",
      error: "bg-red-500/10 text-red-600 ring-orange-600/20",
      warning: "bg-yellow-500/10 text-yellow-600 ring-yellow-600/20",
      info: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
    },
    size: {
      md: "h-6 px-2.5 text-sm",
      sm: "h-5 px-2 text-xs",
      xs: "h-4 px-1.5 text-[10px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface BadgeProps extends React.ComponentPropsWithRef<"div"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
  asChild?: boolean;
}

const Badge = ({
  ref,
  children,
  variant = "neutral",
  size = "md",
  className,
  asChild,
  ...rest
}: BadgeProps) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...rest}
    >
      {children}
    </Comp>
  );
};

const BadgeIcon = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      data-badge-icon
      className={cn("flex items-center justify-center", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const BadgeStatus = ({
  className,
  ...rest
}: Omit<React.ComponentPropsWithRef<"div">, "children">) => {
  return (
    <div
      className={cn(
        "mx-0.5 size-1.5 rounded-full bg-current first:ml-0 last:mr-0",
        className
      )}
      {...rest}
    />
  );
};

export { Badge, BadgeIcon, BadgeStatus };
