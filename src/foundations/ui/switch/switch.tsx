import { cn } from "@/lib/utils/classnames";

const Switch = ({ className, ...props }: Omit<React.ComponentPropsWithRef<"input">, "type">) => {
  return (
    <input
      type="checkbox"
      // biome-ignore lint/a11y/useAriaPropsForRole: native checkbox supplies the implicit aria-checked state
      role="switch"
      className={cn(
        "appearance-none",
        "relative h-6 w-11 cursor-pointer rounded-full bg-foreground/20 transition",
        // circle
        "before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:bg-background before:transition-transform before:duration-200 before:ease-emphasized-decelerate",
        // disabled
        "disabled:before:opacity-30",
        // checked
        "checked:bg-foreground checked:before:translate-x-full",
        // focus
        "focus-visible:ring-(length:--ring-width) focus-visible:outline-none focus-visible:ring-ring",
        // stretch animation
        "before:origin-left active:before:scale-x-110 active:checked:before:origin-right",
        className,
      )}
      {...props}
    />
  );
};

export { Switch };
