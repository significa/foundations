"use client";

import {
  createContext,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  use,
} from "react";
import { VariantProps } from "cva";
import { Slot } from "@radix-ui/react-slot";

import { cva, cn } from "@/lib/utils";

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

const BadgePropsContext = createContext<
  Required<Pick<BadgeProps, "variant" | "size">>
>({
  variant: "neutral",
  size: "md",
});

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
    <BadgePropsContext value={{ variant, size }}>
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...rest}
      >
        {children}
      </Comp>
    </BadgePropsContext>
  );
};

const BadgeIcon: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...rest
}) => {
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

type BadgeStatusProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

const BadgeStatus: FC<PropsWithChildren<BadgeStatusProps>> = ({
  className,
  ...rest
}) => {
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

type BadgeAddonProps = HTMLAttributes<HTMLDivElement>;

const addonVariants = cva({
  base: "inline-flex h-5 items-center justify-center gap-1 bg-background px-1.5 text-foreground-secondary ring-1 ring-inset first:-ml-2 first:rounded-l-full last:-mr-2 last:rounded-r-full [&:first-child>[data-badge-icon]:first-child]:-ml-0.5 [&:last-child>[data-badge-icon]:last-child]:-mr-0.5",
  variants: {
    variant: {
      neutral: "ring-foreground/20",
      success: "ring-emerald-600/20",
      error: "ring-orange-600/20",
      warning: "ring-yellow-600/20",
      info: "ring-blue-700/10",
    },
  },
});

const BadgeAddon: FC<PropsWithChildren<BadgeAddonProps>> = ({
  children,
  className,
  ...rest
}) => {
  const context = use(BadgePropsContext);

  return (
    <div
      className={cn(addonVariants({ variant: context.variant }), className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export { Badge, BadgeAddon, BadgeIcon, BadgeStatus };
