import { createContext, use, useCallback, useId, useLayoutEffect, useMemo, useState } from "react";

import { Slot } from "#/foundations/components/slot/slot.tsx";
import { cn } from "#/lib/utils/classnames.ts";

type TabsVariant = "pill" | "underline";

interface TabsContextValue {
  id: string;
  values: string[];
  selectedValue: string | undefined;
  select: (value: string) => void;
  orientation: "horizontal" | "vertical";
  variant: TabsVariant;
  registerTab: (value: string) => () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = use(TabsContext);
  if (!context) throw new Error("TabsContext must be used within a Tabs component");
  return context;
};

interface TabsProps extends React.ComponentPropsWithRef<"div"> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsContextValue["orientation"];
  variant?: TabsVariant;
  children: React.ReactNode;
}

const Tabs = ({
  defaultValue,
  value: valueProp,
  onValueChange,
  orientation = "horizontal",
  variant = "pill",
  children,
  ...props
}: TabsProps) => {
  // must be a valid CSS <dashed-ident>
  const id = useId().replace(/[^\w-]/g, "");
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [values, setValues] = useState<string[]>([]);

  const currentValue = valueProp ?? internalValue;
  // A value with no tab selects nothing. Before tabs register (SSR, first render), trust it.
  const selectedValue =
    currentValue !== undefined && (values.length === 0 || values.includes(currentValue))
      ? currentValue
      : undefined;

  // Uncontrolled: with no default, or once the selected tab is gone, select the first tab.
  // Not a user action, so onValueChange doesn't fire.
  useLayoutEffect(() => {
    if (valueProp !== undefined || values.length === 0) return;
    if (internalValue !== undefined && values.includes(internalValue)) return;
    setInternalValue(values[0]);
  }, [valueProp, internalValue, values]);

  const select = useCallback(
    (value: string) => {
      document.getElementById(getTabId(id, value))?.focus();
      if (value === selectedValue) return;
      setInternalValue(value);
      onValueChange?.(value);
    },
    [id, selectedValue, onValueChange],
  );

  const registerTab = useCallback(
    (value: string) => {
      // A tab shown again registers last; keep DOM order for arrow keys and the default tab.
      setValues((prev) => sortByDomOrder(id, [...prev, value]));

      return () => {
        setValues((prev) => prev.filter((prevValue) => prevValue !== value));
      };
    },
    [id],
  );

  const ctx = useMemo(
    () => ({ id, values, selectedValue, select, orientation, variant, registerTab }),
    [id, values, selectedValue, select, orientation, variant, registerTab],
  );

  return (
    <TabsContext value={ctx}>
      <div {...props}>{children}</div>
    </TabsContext>
  );
};

interface TabsItemsProps extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
  children: React.ReactNode;
}

const TabsItems = ({ children, className, ...props }: TabsItemsProps) => {
  const { orientation, variant } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "relative isolate flex",
        variant === "pill" && "gap-1.5",
        orientation === "horizontal"
          ? variant === "pill"
            ? "items-center pb-4"
            : "mb-4 items-center border-b border-border"
          : variant === "pill"
            ? "flex-col items-start pr-4"
            : "mr-4 flex-col items-start border-r border-border",
        className,
      )}
      {...props}
    >
      {children}
      {/* after the tabs, or it can't anchor to them */}
      <TabsIndicator />
    </div>
  );
};

// ids can't hold whitespace (aria-controls is a space-separated list)
const getTabId = (tabsId: string, value: string) => `${tabsId}-tab-${encodeURIComponent(value)}`;
const getPanelId = (tabsId: string, value: string) =>
  `${tabsId}-panel-${encodeURIComponent(value)}`;

// values are arbitrary strings, so escape them into a valid ident
const getAnchorName = (tabsId: string, value: string) =>
  `--tabs-${tabsId}-${value.replace(/[^\w-]/gu, (char) => `\\${char.codePointAt(0)?.toString(16)} `)}`;

const sortByDomOrder = (tabsId: string, values: string[]) =>
  values.toSorted((a, b) => {
    const elementA = document.getElementById(getTabId(tabsId, a));
    const elementB = document.getElementById(getTabId(tabsId, b));
    if (!elementA || !elementB) return 0;
    return elementA.compareDocumentPosition(elementB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

// Named anchor() (not position-anchor) so the insets' computed value changes and transitions.
// Firefox doesn't animate anchor() yet: https://bugzil.la/1924226
const TabsIndicator = () => {
  const { id, selectedValue, variant, orientation } = useTabsContext();

  if (selectedValue === undefined) return null;

  return (
    <span
      data-tab-indicator=""
      aria-hidden="true"
      style={{ "--tab-anchor": getAnchorName(id, selectedValue) }}
      className={cn(
        "pointer-events-none absolute z-0",
        "transition-[top,right,bottom,left] duration-300 ease-spring motion-reduce:transition-none",
        variant === "pill" && [
          "rounded-xl bg-background-secondary",
          "top-[anchor(var(--tab-anchor)_top)] right-[anchor(var(--tab-anchor)_right)] bottom-[anchor(var(--tab-anchor)_bottom)] left-[anchor(var(--tab-anchor)_left)]",
        ],
        variant === "underline" &&
          (orientation === "horizontal"
            ? "right-[anchor(var(--tab-anchor)_right)] bottom-[anchor(var(--tab-anchor)_bottom)] left-[anchor(var(--tab-anchor)_left)] h-0.5 bg-accent"
            : "top-[anchor(var(--tab-anchor)_top)] right-[anchor(var(--tab-anchor)_right)] bottom-[anchor(var(--tab-anchor)_bottom)] w-0.5 bg-accent"),
      )}
    />
  );
};

interface TabsItemProps
  extends Omit<React.ComponentPropsWithRef<"button">, "id" | "type" | "disabled" | "value"> {
  value: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const KEYS = {
  horizontal: { next: "ArrowRight", previous: "ArrowLeft" },
  vertical: { next: "ArrowDown", previous: "ArrowUp" },
};

const TabsItem = ({
  value,
  children,
  asChild,
  onClick,
  onKeyDown,
  className,
  style,
  ...props
}: TabsItemProps) => {
  const {
    id: tabsId,
    values,
    selectedValue,
    select,
    registerTab,
    orientation,
    variant,
  } = useTabsContext();

  const Comp = asChild ? Slot : "button";

  useLayoutEffect(() => {
    return registerTab(value);
  }, [value, registerTab]);

  const isSelected = selectedValue === value;
  // Roving tabindex: with no tab selected, the first one stays reachable.
  const isTabbable = isSelected || (selectedValue === undefined && values[0] === value);

  const handleKeyboardNavigation = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Buttons click on Enter and Space, links on Enter; anything else (asChild) gets a click.
    const element = e.currentTarget;
    const clicksNatively =
      element.tagName === "BUTTON" ||
      (element.tagName === "A" && element.hasAttribute("href") && e.key === "Enter");
    if ((e.key === "Enter" || e.key === " ") && !clicksNatively) {
      e.preventDefault();
      element.click();
      return;
    }

    const index = values.indexOf(value);
    let target: string | undefined;

    if (e.key === KEYS[orientation].next) target = values[(index + 1) % values.length];
    if (e.key === KEYS[orientation].previous) target = values.at(index <= 0 ? -1 : index - 1);
    if (e.key === "Home") target = values[0];
    if (e.key === "End") target = values.at(-1);
    if (target === undefined) return;

    e.preventDefault();
    select(target);
  };

  return (
    <Comp
      id={getTabId(tabsId, value)}
      type={asChild ? undefined : "button"}
      className={cn(
        "relative z-10 flex cursor-pointer items-center justify-center gap-1.5 px-4 py-2 text-foreground/50 ring-ring transition outline-none hover:text-foreground focus-visible:ring-(length:--ring-width) data-selected:text-foreground",
        variant === "pill" && "rounded-xl",
        variant === "underline" && (orientation === "horizontal" ? "-mb-px" : "-mr-px"),
        className,
      )}
      role="tab"
      aria-controls={getPanelId(tabsId, value)}
      aria-selected={isSelected}
      data-selected={isSelected || undefined}
      tabIndex={isTabbable ? 0 : -1}
      style={{ anchorName: getAnchorName(tabsId, value), ...style }}
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) {
          select(value);
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);

        if (!e.defaultPrevented) {
          handleKeyboardNavigation(e);
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};

interface TabsPanelsProps extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
  children: React.ReactNode;
}

const TabsPanels = ({ className, ...props }: TabsPanelsProps) => {
  return (
    <div
      className={cn("ring-ring transition has-focus-visible:ring-(length:--ring-width)", className)}
      {...props}
    />
  );
};

interface TabsPanelProps extends Omit<React.ComponentPropsWithRef<"div">, "id"> {
  value: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const TabsPanel = ({ value, children, asChild, className, ...props }: TabsPanelProps) => {
  const { id: tabsId, selectedValue } = useTabsContext();
  const Comp = asChild ? Slot : "div";

  const isSelected = selectedValue === value;

  return (
    <Comp
      id={getPanelId(tabsId, value)}
      role="tabpanel"
      className={cn("outline-none", className)}
      aria-labelledby={getTabId(tabsId, value)}
      aria-hidden={!isSelected}
      data-selected={isSelected || undefined}
      tabIndex={isSelected ? 0 : -1}
      {...props}
    >
      {isSelected ? children : null}
    </Comp>
  );
};

const CompoundTabs = Object.assign(Tabs, {
  Items: TabsItems,
  Item: TabsItem,
  Panels: TabsPanels,
  Panel: TabsPanel,
});

export { CompoundTabs as Tabs };
