import type { VariantProps } from "cva";

import { Slot } from "@/foundations/components/slot/slot";
import { cn, cva } from "@/lib/utils/classnames";

const kbdStyle = cva({
  base: [
    "inline-flex h-(--kbd-height) min-w-(--kbd-height) shrink-0 items-center justify-center",
    "rounded-md border border-border bg-background-secondary",
    "font-mono text-foreground leading-none",
    // 2px hard shadow visually weighs the bottom; lift 1px to optically center
    // against surrounding text.
    "-translate-y-px shadow-[0_2px_0_0_var(--color-border)]",
  ],
  variants: {
    size: {
      sm: "px-1 text-2xs [--kbd-height:--spacing(4)]",
      md: "px-1.5 text-xs [--kbd-height:--spacing(5)]",
      lg: "px-2 text-sm [--kbd-height:--spacing(6)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface KbdProps extends React.ComponentPropsWithRef<"kbd"> {
  size?: VariantProps<typeof kbdStyle>["size"];
  asChild?: boolean;
}

const Kbd = ({ ref, children, size = "md", className, asChild, ...rest }: KbdProps) => {
  const Comp = asChild ? Slot : "kbd";

  return (
    <Comp ref={ref} className={cn(kbdStyle({ size }), className)} {...rest}>
      {children}
    </Comp>
  );
};

const KbdGroup = ({ className, children, ...rest }: React.ComponentPropsWithRef<"span">) => {
  return (
    <span className={cn("inline-flex items-center gap-1 align-middle", className)} {...rest}>
      {children}
    </span>
  );
};

const CompoundKbd = Object.assign(Kbd, {
  Group: KbdGroup,
});

export { CompoundKbd as Kbd };
