import { cva } from "@/lib/utils/classnames";

const radioStyle = cva({
  base: [
    "border-border bg-background enabled:not-checked:hover:border-mix-border/8 ring-ring relative flex size-5 shrink-0 appearance-none items-center justify-center rounded-full border shadow-xs transition outline-none focus-visible:ring-4 enabled:cursor-pointer",
    // checked
    "checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8 checked:enabled:hover:mix-with-accent-foreground",
    // checked circle
    "checked:before:bg-accent-foreground checked:before:absolute checked:before:h-1.5 checked:before:w-1.5 checked:before:rounded-full",
    // disabled
    "disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:bg-foreground/50 disabled:cursor-not-allowed",
  ],
});

const Radio = ({ className, ...props }: Omit<React.ComponentPropsWithRef<"input">, "type">) => {
  return <input type="radio" className={radioStyle({ className })} {...props} />;
};

export { Radio };
