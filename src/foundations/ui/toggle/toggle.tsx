import type { VariantProps } from "cva";
import {
  Children,
  createContext,
  isValidElement,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils/classnames";
import { buttonStyle } from "../button/button";

type ToggleStyleProps = Pick<VariantProps<typeof buttonStyle>, "size" | "square">;

interface ToggleProps
  extends Omit<React.ComponentPropsWithRef<"button">, "onChange">,
    ToggleStyleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  asChild?: boolean;
}

const Toggle = ({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  size = "md",
  square,
  asChild = false,
  className,
  type = "button",
  onClick,
  ref,
  children,
  ...props
}: ToggleProps) => {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const pressed = pressedProp ?? internalPressed;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={type}
      className={cn(buttonStyle({ variant: "ghost", size, square }), className)}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const next = !pressed;
        if (pressedProp === undefined) setInternalPressed(next);
        onPressedChange?.(next);
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};

interface ToggleGroupContextValue {
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
  tabbableValue: string | undefined;
  setTabbableValue: (value: string) => void;
  focusItem: (value: string) => void;
  registerItem: (value: string) => () => void;
  items: string[];
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  size: ToggleStyleProps["size"];
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroupContext = () => {
  const ctx = use(ToggleGroupContext);
  if (!ctx) {
    throw new Error("ToggleGroup.Item must be used within a ToggleGroup");
  }
  return ctx;
};

type ToggleGroupBaseProps = Omit<React.ComponentPropsWithRef<"div">, "onChange" | "defaultValue"> &
  Pick<ToggleStyleProps, "size"> & {
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
  };

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroup = (props: ToggleGroupProps) => {
  return props.type === "single" ? (
    <ToggleGroupSingle {...props} />
  ) : (
    <ToggleGroupMultiple {...props} />
  );
};

const ToggleGroupSingle = ({
  type: _type,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...rest
}: ToggleGroupSingleProps) => {
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const value = valueProp ?? internal;

  const isPressed = useCallback((v: string) => value === v, [value]);
  const toggle = useCallback(
    (v: string) => {
      const next = value === v ? undefined : v;
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, valueProp, onValueChange],
  );

  return <ToggleGroupRoot {...rest} isPressed={isPressed} toggle={toggle} />;
};

const ToggleGroupMultiple = ({
  type: _type,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...rest
}: ToggleGroupMultipleProps) => {
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internal;

  const isPressed = useCallback((v: string) => value.includes(v), [value]);
  const toggle = useCallback(
    (v: string) => {
      const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, valueProp, onValueChange],
  );

  return <ToggleGroupRoot {...rest} isPressed={isPressed} toggle={toggle} />;
};

interface ToggleGroupRootProps extends ToggleGroupBaseProps {
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
}

const ToggleGroupRoot = ({
  isPressed,
  toggle,
  orientation = "horizontal",
  disabled = false,
  size = "md",
  className,
  children,
  ref,
  ...divProps
}: ToggleGroupRootProps) => {
  const [items, setItems] = useState<string[]>([]);

  const registerItem = useCallback((value: string) => {
    setItems((prev) => (prev.includes(value) ? prev : [...prev, value]));
    return () => {
      setItems((prev) => prev.filter((v) => v !== value));
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const focusItem = useCallback((value: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-toggle-group-value="${CSS.escape(value)}"]`,
    );
    el?.focus();
  }, []);

  const [tabbable, setTabbable] = useState<string | undefined>(undefined);

  const tabbableValue = useMemo(() => {
    if (items.length > 0) {
      if (tabbable && items.includes(tabbable)) return tabbable;
      const firstPressed = items.find((v) => isPressed(v));
      return firstPressed ?? items[0];
    }
    // Pre-registration (SSR / first paint): items register via useLayoutEffect,
    // so on the server they're empty. Walk children directly so the right item
    // is the tab stop on the very first render.
    const childValues: string[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement<{ value?: unknown }>(child) && typeof child.props.value === "string") {
        childValues.push(child.props.value);
      }
    });
    const firstPressed = childValues.find((v) => isPressed(v));
    return firstPressed ?? childValues[0];
  }, [tabbable, items, isPressed, children]);

  const setTabbableValue = useCallback((value: string) => {
    setTabbable(value);
  }, []);

  const ctx = useMemo<ToggleGroupContextValue>(
    () => ({
      isPressed,
      toggle,
      tabbableValue,
      setTabbableValue,
      focusItem,
      registerItem,
      items,
      orientation,
      disabled,
      size,
    }),
    [
      isPressed,
      toggle,
      tabbableValue,
      setTabbableValue,
      focusItem,
      registerItem,
      items,
      orientation,
      disabled,
      size,
    ],
  );

  return (
    <ToggleGroupContext value={ctx}>
      {/* biome-ignore lint/a11y/useSemanticElements: <fieldset> is form-only semantics; this is a toolbar-style grouping. */}
      <div
        ref={composeRefs(containerRef, ref)}
        role="group"
        data-orientation={orientation}
        className={cn(
          "flex items-center *:focus-visible:z-2",
          orientation === "vertical" && "flex-col",
          className,
        )}
        data-ui-button-group
        {...divProps}
      >
        {children}
      </div>
    </ToggleGroupContext>
  );
};

interface ToggleGroupItemProps
  extends Omit<React.ComponentPropsWithRef<"button">, "value" | "type" | "disabled" | "onChange">,
    ToggleStyleProps {
  value: string;
  asChild?: boolean;
  disabled?: boolean;
}

const ToggleGroupItem = ({
  value,
  size: sizeProp,
  square,
  asChild = false,
  className,
  disabled: disabledProp,
  onClick,
  onKeyDown,
  onFocus,
  ref,
  children,
  ...props
}: ToggleGroupItemProps) => {
  const ctx = useToggleGroupContext();
  const Comp = asChild ? Slot : "button";

  useLayoutEffect(() => {
    return ctx.registerItem(value);
  }, [value, ctx.registerItem]);

  const pressed = ctx.isPressed(value);
  const isTabbable = ctx.tabbableValue === value;
  const disabled = disabledProp || ctx.disabled;
  const size = sizeProp ?? ctx.size;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const orientation = ctx.orientation;
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    if (e.key !== nextKey && e.key !== prevKey && e.key !== "Home" && e.key !== "End") {
      return;
    }

    e.preventDefault();
    const idx = ctx.items.indexOf(value);
    if (idx === -1) return;

    let nextIdx = idx;
    if (e.key === nextKey) nextIdx = (idx + 1) % ctx.items.length;
    else if (e.key === prevKey) nextIdx = (idx - 1 + ctx.items.length) % ctx.items.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = ctx.items.length - 1;

    const nextValue = ctx.items[nextIdx];
    if (!nextValue) return;

    ctx.setTabbableValue(nextValue);
    ctx.focusItem(nextValue);
  };

  return (
    <Comp
      ref={ref}
      type="button"
      data-toggle-group-value={value}
      className={cn(buttonStyle({ variant: "ghost", size, square }), className)}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={isTabbable ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.toggle(value);
        ctx.setTabbableValue(value);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) handleKeyDown(e);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (!e.defaultPrevented) ctx.setTabbableValue(value);
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};

const CompoundToggleGroup = Object.assign(ToggleGroup, {
  Item: ToggleGroupItem,
});

export type { ToggleGroupItemProps, ToggleGroupProps, ToggleProps };
export { CompoundToggleGroup as ToggleGroup, Toggle };
