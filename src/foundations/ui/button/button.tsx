import type { VariantProps } from "cva";
import { Children, Fragment } from "react";
import { Slot, Slottable } from "#/foundations/components/slot/slot.tsx";
import { Divider } from "#/foundations/ui/divider/divider.tsx";
import { Spinner } from "#/foundations/ui/spinner/spinner.tsx";
import { cn, cva } from "#/lib/utils/classnames.ts";

const buttonStyle = cva({
  base: [
    "relative inline-flex h-(--button-height) shrink-0 items-center justify-center gap-1.5 font-medium whitespace-nowrap text-(--button-text-color) shadow-xs [--button-text-color:var(--color-foreground)]",
    // `not-disabled:`, not `enabled:`, which never matches an `asChild` <a>. A disabled link has
    // only aria-disabled, so it dims too; a loading button (aria-busy) doesn't.
    "transition not-disabled:not-aria-disabled:cursor-pointer disabled:opacity-40 aria-disabled:not-aria-busy:opacity-40",
    "active:not-in-data-ui-button-group:scale-98",
    "ring-ring focus-visible:ring-(length:--ring-width) focus-visible:outline-none",
    // inside button group — horizontal merge (default; ToggleGroup may set
    // data-orientation="vertical" on its container to flip the axis)
    "in-data-ui-button-group:not-in-data-[orientation=vertical]:not-last:rounded-r-none",
    "in-data-ui-button-group:not-in-data-[orientation=vertical]:not-last:border-r-0",
    "in-data-ui-button-group:not-in-data-[orientation=vertical]:not-first:rounded-l-none",
    "in-data-ui-button-group:not-in-data-[orientation=vertical]:not-first:border-l-0",
    // inside button group — vertical merge
    "in-data-ui-button-group:in-data-[orientation=vertical]:not-last:rounded-b-none",
    "in-data-ui-button-group:in-data-[orientation=vertical]:not-last:border-b-0",
    "in-data-ui-button-group:in-data-[orientation=vertical]:not-first:rounded-t-none",
    "in-data-ui-button-group:in-data-[orientation=vertical]:not-first:border-t-0",
    // pressed state — set via data-pressed by Toggle / ToggleGroup.Item.
    // Subtle filled tint that layers over `ghost` and `outline` without flipping
    // the text color; the higher selector specificity beats the variant background.
    "data-pressed:bg-foreground/10 data-pressed:not-disabled:not-aria-disabled:hover:bg-foreground/15",
  ],
  variants: {
    variant: {
      primary:
        "bg-accent [--button-text-color:var(--color-accent-foreground)] not-disabled:not-aria-disabled:hover:bg-accent/90 in-data-ui-button-group:active:bg-accent/80",
      outline:
        "border border-border bg-background not-disabled:not-aria-disabled:hover:bg-foreground/2 not-in-data-ui-button-group:focus-visible:border-accent in-data-ui-button-group:active:bg-foreground/4",
      ghost:
        "border-none bg-transparent shadow-none ring-0 not-disabled:not-aria-disabled:hover:bg-foreground/5 in-data-ui-button-group:active:bg-foreground/10",
      destructive:
        "bg-error ring-error/50 [--button-text-color:var(--color-white)] not-disabled:not-aria-disabled:hover:bg-error/90",
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
  type,
  disabled,
  onClick,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  // Loading isn't `disabled`, which drops focus to <body>. Mouse, Enter, Space and implicit submit
  // all arrive as `click`; preventDefault also stops the asChild child's onClick and a link's href.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      className={cn(
        buttonStyle({
          className,
          variant,
          size,
          square,
        }),
        isLoading && "text-transparent transition-none",
      )}
      ref={ref}
      // Under `asChild` an explicit type passes through; Slot defaults a <button> child without one.
      type={asChild ? type : (type ?? "button")}
      // A link has no `disabled`; it would render as `disabled=""` on the <a>.
      disabled={asChild ? undefined : disabled}
      aria-disabled={isLoading || (asChild && disabled) || undefined}
      aria-busy={isLoading || undefined}
      {...props}
      onClick={handleClick}
    >
      <Slottable asChild={asChild} child={children}>
        {(child) => (
          <>
            {child}
            {isLoading && (
              <span
                data-button-spinner
                className={cn(
                  "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2",
                  "text-(--button-text-color)",
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

export interface IconButtonProps extends Omit<ButtonProps, "square"> {
  "aria-label": string;
}

const IconButton = ({ ref, ...props }: IconButtonProps) => {
  return <Button square {...props} ref={ref} />;
};

type ButtonGroupProps = React.ComponentPropsWithRef<"div">;

const ButtonGroup = ({ className, children, ...props }: ButtonGroupProps) => {
  return (
    <div
      className={cn("flex items-center *:focus-visible:z-2", className)}
      data-ui-button-group
      {...props}
    >
      {Children.toArray(children).map((child, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && <Divider orientation="vertical" className="z-1 -mr-px h-[1em] w-px" />}
            {child}
          </Fragment>
        );
      })}
    </div>
  );
};

const CompoundButton = Object.assign(Button, {
  Group: ButtonGroup,
});

export { buttonStyle, CompoundButton as Button, IconButton };
