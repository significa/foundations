import type { VariantProps } from "cva";
import { Children, Fragment } from "react";
import { Slot, Slottable } from "#/foundations/components/slot/slot.tsx";
import { Divider } from "#/foundations/ui/divider/divider.tsx";
import { Spinner } from "#/foundations/ui/spinner/spinner.tsx";
import { cn, cva } from "#/lib/utils/classnames.ts";

const buttonStyle = cva({
  base: [
    "relative inline-flex h-(--button-height) shrink-0 items-center justify-center gap-1.5 font-medium whitespace-nowrap text-(--button-text-color) [--button-text-color:var(--color-foreground)]",
    // `not-disabled:`, not `enabled:`, which never matches an `asChild` <a>. A disabled link has
    // only aria-disabled, so it dims too; a loading button (aria-busy) doesn't.
    "transition not-disabled:not-aria-disabled:cursor-pointer disabled:opacity-40 aria-disabled:not-aria-busy:opacity-40",
    // --press-scale/--press-offset and the control-edge shadows come from the theme: shrink, sink, or neither
    "not-aria-disabled:active:not-in-data-ui-button-group:translate-y-(--press-offset) not-aria-disabled:active:not-in-data-ui-button-group:scale-(--press-scale)",
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
    // pressed state — set via data-pressed by Toggle / ToggleGroup.Item. A faint tint by default;
    // set --button-pressed-bg/--button-pressed-text for a solid chip. Hover moves the fill toward the text.
    "[--button-pressed-bg:color-mix(in_oklab,var(--color-foreground)_10%,transparent)] [--button-pressed-text:var(--button-text-color)]",
    "data-pressed:bg-(--button-pressed-bg) data-pressed:text-(--button-pressed-text) data-pressed:not-disabled:not-aria-disabled:hover:bg-[color-mix(in_oklab,var(--button-pressed-bg),currentColor_10%)]",
  ],
  variants: {
    variant: {
      primary:
        "bg-accent shadow-control [--button-text-color:var(--color-accent-foreground)] not-disabled:not-aria-disabled:hover:bg-accent/90 not-aria-disabled:active:not-in-data-ui-button-group:shadow-control-pressed in-data-ui-button-group:not-aria-disabled:active:bg-accent/80",
      outline:
        "border border-border bg-control shadow-control not-disabled:not-aria-disabled:hover:bg-mix-control/3 not-in-data-ui-button-group:focus-visible:border-accent not-aria-disabled:active:not-in-data-ui-button-group:shadow-control-pressed in-data-ui-button-group:not-aria-disabled:active:bg-foreground/4",
      ghost:
        "bg-transparent shadow-none ring-0 not-disabled:not-aria-disabled:hover:bg-foreground/5 in-data-ui-button-group:not-aria-disabled:active:bg-foreground/10",
      destructive:
        "bg-error shadow-control ring-error/50 [--button-text-color:var(--color-white)] not-disabled:not-aria-disabled:hover:bg-error/90 not-aria-disabled:active:not-in-data-ui-button-group:shadow-control-pressed",
    },
    size: {
      xs: "rounded-lg px-2 text-sm [--button-height:var(--control-height-xs)]",
      sm: "rounded-lg px-3 text-sm [--button-height:var(--control-height-sm)]",
      md: "rounded-xl px-4 text-base [--button-height:var(--control-height-md)]",
      lg: "rounded-2xl px-5 text-base [--button-height:var(--control-height-lg)]",
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
  onClickCapture,
  onAuxClickCapture,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  // aria-disabled/aria-busy keep the button focusable, so it blocks clicks itself: in capture, like
  // a native disabled <button>, so no onClick runs (ancestors' included).
  const blockWhenDisabled = (event: React.SyntheticEvent) => {
    if (!disabled && !isLoading) return;
    event.preventDefault();
    event.stopPropagation();
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
      onClickCapture={(event) => {
        blockWhenDisabled(event);
        onClickCapture?.(event);
      }}
      onAuxClickCapture={(event) => {
        blockWhenDisabled(event);
        onAuxClickCapture?.(event);
      }}
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
