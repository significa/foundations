import {
  createContext,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Slot } from "#/foundations/components/slot/slot.tsx";
import { composeRefs } from "#/foundations/utils/compose-refs/compose-refs.ts";
import { cn } from "#/lib/utils/classnames.ts";

type TabsVariant = "pill" | "underline";

interface TabsContextValue {
  id: string;
  selectedValue: string;
  select: (value: string) => void;
  isControlled: boolean;
  setInternalValue: (value: string) => void;
  orientation: "horizontal" | "vertical";
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = use(TabsContext);
  if (!context) throw new Error("TabsContext must be used within a Tabs component");
  return context;
};

type TabsProps = Omit<React.ComponentPropsWithRef<"div">, "defaultValue"> & {
  orientation?: TabsContextValue["orientation"];
  variant?: TabsVariant;
  children: React.ReactNode;
} & (
    | { value: string; onValueChange: (value: string) => void; defaultValue?: never }
    | { defaultValue: string; onValueChange?: (value: string) => void; value?: never }
  );

const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  variant = "pill",
  children,
  ...props
}: TabsProps) => {
  // must be a valid CSS <dashed-ident>
  const id = useId().replace(/[^\w-]/g, "");
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const isControlled = value !== undefined;
  const selectedValue = value ?? internalValue;

  const select = useCallback(
    (next: string) => {
      document.getElementById(getTabId(id, next))?.focus();
      if (next === selectedValue) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [id, selectedValue, isControlled, onValueChange],
  );

  const ctx = useMemo(
    () => ({ id, selectedValue, select, isControlled, setInternalValue, orientation, variant }),
    [id, selectedValue, select, isControlled, orientation, variant],
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

const TabsItems = ({ children, className, ref, ...props }: TabsItemsProps) => {
  const { isControlled, setInternalValue, orientation, variant } = useTabsContext();
  const tablistRef = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(ref, tablistRef), [ref]);

  // Uncontrolled and the selected tab isn't rendered: fall back to the first one, before paint.
  // Read from the DOM so tabs inside fragments or wrapper components count.
  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (isControlled || !tablist) return;
    if (tablist.querySelector('[role="tab"][data-selected]')) return;

    const first = tablist.querySelector<HTMLElement>('[role="tab"]')?.dataset.value;
    if (first !== undefined) setInternalValue(first);
  });

  return (
    <div
      ref={composedRef}
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "relative isolate flex",
        variant === "pill" && "gap-1.5",
        orientation === "horizontal"
          ? variant === "pill"
            ? "items-center pb-4"
            : "mb-4 items-center border-b border-border-subtle"
          : variant === "pill"
            ? "flex-col items-start pr-4"
            : "mr-4 flex-col items-start border-r border-border-subtle",
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

// Named anchor() (not position-anchor) so the insets' computed value changes and transitions.
// Firefox doesn't animate anchor() yet: https://bugzil.la/1924226
const TabsIndicator = () => {
  const { id, selectedValue, variant, orientation } = useTabsContext();

  return (
    <span
      data-tab-indicator=""
      aria-hidden="true"
      style={{ "--tab-anchor": getAnchorName(id, selectedValue) }}
      className={cn(
        "pointer-events-none absolute z-0",
        "transition-[top,right,bottom,left] duration-300 ease-spring motion-reduce:transition-none",
        variant === "pill" && [
          "rounded-xl bg-foreground/5",
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
  const { id: tabsId, selectedValue, select, orientation, variant } = useTabsContext();

  const Comp = asChild ? Slot : "button";

  const isSelected = selectedValue === value;

  const handleKeyboardNavigation = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tablist = e.currentTarget.closest('[role="tablist"]');
    const tabs = [...(tablist?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])].filter(
      (tab) => tab.closest('[role="tablist"]') === tablist,
    );
    const index = tabs.indexOf(e.currentTarget);
    let target: HTMLElement | undefined;

    if (e.key === KEYS[orientation].next) target = tabs[(index + 1) % tabs.length];
    if (e.key === KEYS[orientation].previous) target = tabs.at(index <= 0 ? -1 : index - 1);
    if (e.key === "Home") target = tabs[0];
    if (e.key === "End") target = tabs.at(-1);
    if (!target) return;

    const targetValue = target.dataset.value;
    if (targetValue === undefined) return;

    e.preventDefault();
    select(targetValue);
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
      data-value={value}
      tabIndex={isSelected ? 0 : -1}
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
