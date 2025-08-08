"use client";

import { VariantProps } from "cva";
import {
  Children,
  createContext,
  isValidElement,
  use,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn, cva } from "@/lib/utils";

const inputStyle = cva({
  base: [
    "transition",
    "w-full border h-10 rounded-xl px-4 py-1 text-base font-medium",
    "focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-ring focus-visible:text-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground/80 placeholder:text-foreground-secondary data-invalid:border-red-500 data-invalid:hover:border-red-600 data-invalid:focus-visible:border-red-500 data-invalid:focus-visible:ring-red-500/20",
    "pl-(--prefix-width,calc(var(--spacing)*4))",
    "pr-(--suffix-width,calc(var(--spacing)*4))",
  ],
  variants: {
    variant: {
      default:
        "border-border bg-background hover:border-mix-border/8 shadow-xs",
      minimal:
        "border-transparent bg-transparent hover:bg-background-secondary focus-visible:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps
  extends Omit<React.ComponentPropsWithRef<"input">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Input = ({ className, invalid, variant, ...props }: InputProps) => {
  return (
    <input
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(inputStyle({ variant }), className)}
      {...props}
    />
  );
};

interface InputGroupContextType {
  prefixWidth: number;
  suffixWidth: number;
  setPrefixWidth: (width: number) => void;
  setSuffixWidth: (width: number) => void;
}

const InputGroupContext = createContext<InputGroupContextType>({
  prefixWidth: 0,
  suffixWidth: 0,
  setPrefixWidth: () => {},
  setSuffixWidth: () => {},
});

const useInputGroup = () => {
  const ctx = use(InputGroupContext);

  if (!ctx) {
    throw new Error("InputGroup must be used within an InputGroupContext");
  }

  return ctx;
};

const InputGroup = ({
  className,
  style,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const [prefixWidth, setPrefixWidth] = useState(0);
  const [suffixWidth, setSuffixWidth] = useState(0);

  // check if there are more than one InputPrefix or InputSuffix
  const tooManyPrefixes =
    Children.toArray(props.children).filter(
      (child) => isValidElement(child) && child.type === InputPrefix
    ).length > 1;

  const tooManySuffixes =
    Children.toArray(props.children).filter(
      (child) => isValidElement(child) && child.type === InputSuffix
    ).length > 1;

  if (tooManyPrefixes || tooManySuffixes) {
    throw new Error(
      "InputGroup cannot have more than one InputPrefix or InputSuffix"
    );
  }

  return (
    <InputGroupContext
      value={{ prefixWidth, suffixWidth, setPrefixWidth, setSuffixWidth }}
    >
      <div
        className={cn("relative", className)}
        style={{
          ...(prefixWidth > 0 && {
            "--prefix-width": `calc(${prefixWidth}px + var(--spacing)*5.5)`,
          }),
          ...(suffixWidth > 0 && {
            "--suffix-width": `calc(${suffixWidth}px + var(--spacing)*5.5)`,
          }),
          ...style,
        }}
        {...props}
      />
    </InputGroupContext>
  );
};

interface InputPrefixProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const InputPrefix = (props: InputPrefixProps) => {
  const { setPrefixWidth } = useInputGroup();

  return <InputAddon {...props} onSetWidth={setPrefixWidth} />;
};

interface InputSuffixProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const InputSuffix = (props: InputSuffixProps) => {
  const { setSuffixWidth } = useInputGroup();

  return <InputAddon {...props} onSetWidth={setSuffixWidth} />;
};

interface InputAddonProps extends React.ComponentPropsWithRef<"div"> {
  onSetWidth?: (width: number) => void;
  asChild?: boolean;
}

const InputAddon = ({
  ref,
  className,
  onSetWidth,
  asChild,
  ...props
}: InputAddonProps) => {
  const Comp = asChild ? Slot : "div";
  const internalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    onSetWidth?.(internalRef.current?.offsetWidth ?? 0);

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect.width) {
        onSetWidth?.(Math.round(entry.contentRect.width));
      }
    });

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, [onSetWidth]);

  return (
    <Comp
      data-input-addon
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-base font-medium",
        "text-foreground pointer-events-none first:left-4 last:right-4",
        className
      )}
      ref={composeRefs(ref, internalRef)}
      {...props}
    />
  );
};

export { Input, InputGroup, InputPrefix, inputStyle, InputSuffix };
