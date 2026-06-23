import type { VariantProps } from "cva";

import { Slot } from "@/foundations/components/slot/slot";
import { cn, cva } from "@/lib/utils/classnames";

const badgeStyle = cva({
  base: "inline-flex items-center gap-1 rounded-full font-semibold leading-none ring-1 ring-inset [&>[data-badge-icon]:first-child]:-ml-0.5 [&>[data-badge-icon]:last-child]:-mr-0.5",
  variants: {
    variant: {
      neutral: "bg-background text-foreground/80 ring-foreground/10",
      success: "bg-success/10 text-success ring-success/20",
      error: "bg-error/10 text-error ring-error/20",
      warning: "bg-warning/10 text-warning ring-warning/20",
      info: "bg-info/10 text-info ring-info/20",
    },
    size: {
      md: "h-6 px-2.5 text-sm",
      sm: "h-5 px-2 text-xs",
      xs: "h-4 px-1.5 text-2xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface BadgeProps extends React.ComponentPropsWithRef<"div"> {
  variant?: VariantProps<typeof badgeStyle>["variant"];
  size?: VariantProps<typeof badgeStyle>["size"];
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
    <Comp ref={ref} className={cn(badgeStyle({ variant, size }), className)} {...rest}>
      {children}
    </Comp>
  );
};

const BadgeIcon = ({ children, className, ...rest }: React.ComponentPropsWithRef<"div">) => {
  return (
    <div data-badge-icon className={cn("flex items-center justify-center", className)} {...rest}>
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
      className={cn("mx-0.5 size-1.5 rounded-full bg-current first:ml-0 last:mr-0", className)}
      {...rest}
    />
  );
};

const CompoundBadge = Object.assign(Badge, {
  Icon: BadgeIcon,
  Status: BadgeStatus,
});

export { CompoundBadge as Badge };
