import {
  Children,
  createContext,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { cn } from "@/lib/utils/classnames";

type TabsVariant = "pill" | "underline";

interface TabsContextValue {
  id: string;
  tabs: string[];
  selectedIndex: number;
  selectedTab: string | undefined;
  setSelectedTab: (id: string) => void;
  next: () => void;
  previous: () => void;
  orientation: "horizontal" | "vertical";
  variant: TabsVariant;
  registerTab: (id: string) => () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = use(TabsContext);
  if (!context) throw new Error("TabsContext must be used within a Tabs component");
  return context;
};

interface TabsProps extends Omit<React.ComponentPropsWithRef<"div">, "onChange"> {
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  orientation?: TabsContextValue["orientation"];
  variant?: TabsVariant;
  children: React.ReactNode;
}

const Tabs = ({
  defaultIndex,
  selectedIndex: selectedIndexProp,
  onChange: onChangeProp,
  orientation = "horizontal",
  variant = "pill",
  children,
  ...props
}: TabsProps) => {
  // must be a valid CSS <dashed-ident>
  const id = useId().replace(/[^\w-]/g, "");
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(defaultIndex ?? 0);
  const [tabs, setTabs] = useState<string[]>([]);

  const selectedIndex = selectedIndexProp ?? internalSelectedIndex;

  const setSelectedIndex = useCallback(
    (index: number) => {
      setInternalSelectedIndex(index);
      onChangeProp?.(index);

      // focus on the selected tab when changing index
      const itemId = getItemId(tabs[index]);
      if (itemId) {
        const selectedTab = document.getElementById(itemId);
        selectedTab?.focus();
      }
    },
    [onChangeProp, tabs],
  );

  const next = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % tabs.length);
  }, [tabs.length, selectedIndex, setSelectedIndex]);

  const previous = useCallback(() => {
    setSelectedIndex(selectedIndex <= 0 ? tabs.length - 1 : selectedIndex - 1);
  }, [tabs.length, selectedIndex, setSelectedIndex]);

  const registerTab = useCallback((id: string) => {
    setTabs((prev) => [...prev, id]);

    return () => {
      setTabs((prev) => prev.filter((prevId) => prevId !== id));
    };
  }, []);

  const selectedTab = useMemo(() => tabs[selectedIndex], [tabs, selectedIndex]);

  const setSelectedTab = useCallback(
    (id: string) => {
      setSelectedIndex(tabs.indexOf(id));
    },
    [tabs, setSelectedIndex],
  );

  const ctx = useMemo(
    () => ({
      id,
      tabs,
      selectedIndex,
      selectedTab,
      setSelectedTab,
      next,
      previous,
      orientation,
      variant,
      registerTab,
    }),
    [
      id,
      tabs,
      selectedIndex,
      selectedTab,
      setSelectedTab,
      next,
      previous,
      orientation,
      variant,
      registerTab,
    ],
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

const ItemIndexContext = createContext<number>(0);

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
            : "mb-4 items-center border-border border-b"
          : variant === "pill"
            ? "flex-col items-start pr-4"
            : "mr-4 flex-col items-start border-border border-r",
        className,
      )}
      {...props}
    >
      {Children.map(children, (child, index) => (
        <ItemIndexContext value={index}>{child}</ItemIndexContext>
      ))}
      {/* after the tabs, or it can't anchor to them */}
      <TabsIndicator />
    </div>
  );
};

interface TabsItemProps
  extends Omit<React.ComponentPropsWithRef<"button">, "id" | "type" | "disabled"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const getAnchorName = (tabsId: string, index: number) => `--tabs-${tabsId}-${index}`;

// Named anchor() (not position-anchor) so the insets' computed value changes and transitions.
// Firefox doesn't animate anchor() yet: https://bugzil.la/1924226
const TabsIndicator = () => {
  const { id, selectedIndex, variant, orientation } = useTabsContext();

  return (
    <span
      data-tab-indicator=""
      aria-hidden="true"
      style={{ "--tab-anchor": getAnchorName(id, selectedIndex) }}
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

const getItemId = (id: string | undefined) => (id ? `tab${id}` : undefined);

const TabsItem = ({
  children,
  asChild,
  onClick,
  onKeyDown,
  className,
  style,
  ...props
}: TabsItemProps) => {
  const id = useId();
  const index = use(ItemIndexContext);
  const {
    id: tabsId,
    selectedTab,
    selectedIndex,
    setSelectedTab,
    registerTab,
    orientation,
    variant,
    next,
    previous,
  } = useTabsContext();

  const Comp = asChild ? Slot : "button";

  useLayoutEffect(() => {
    registerTab(id);
  }, [id, registerTab]);

  // Match by id once registered; fall back to index for SSR / initial render.
  const isSelected = selectedTab !== undefined ? selectedTab === id : index === selectedIndex;

  const handleKeyboardNavigation = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setSelectedTab(id);
    }

    const keyOrientationMap = {
      horizontal: {
        next: "ArrowRight",
        prev: "ArrowLeft",
      },
      vertical: {
        next: "ArrowDown",
        prev: "ArrowUp",
      },
    };

    if (keyOrientationMap[orientation].next === e.key) {
      e.preventDefault();
      next();
    }

    if (keyOrientationMap[orientation].prev === e.key) {
      e.preventDefault();
      previous();
    }
  };

  return (
    <Comp
      id={getItemId(id)}
      type={asChild ? undefined : "button"}
      className={cn(
        "focus-visible:ring-(length:--ring-width) relative z-10 flex cursor-pointer items-center justify-center gap-1.5 px-4 py-2 text-foreground/50 outline-none ring-ring transition hover:text-foreground data-selected:text-foreground",
        variant === "pill" && "rounded-xl",
        variant === "underline" && (orientation === "horizontal" ? "-mb-px" : "-mr-px"),
        className,
      )}
      role="tab"
      aria-controls={getPanelId(id)}
      aria-selected={isSelected || undefined}
      data-selected={isSelected || undefined}
      tabIndex={isSelected ? 0 : -1}
      style={{ anchorName: getAnchorName(tabsId, index), ...style }}
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) {
          setSelectedTab(id);
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
      {typeof children === "string" ? <span>{children}</span> : children}
    </Comp>
  );
};

interface TabsPanelsProps extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
  children: React.ReactNode;
}

const TabsPanels = ({ children, className, ...props }: TabsPanelsProps) => {
  const { tabs } = useTabsContext();

  return (
    <div
      className={cn("has-focus-visible:ring-(length:--ring-width) ring-ring transition", className)}
      {...props}
    >
      {Children.map(children, (child, index) => (
        <PanelIndexContext value={index}>
          <PanelIdContext value={tabs[index]}>{child}</PanelIdContext>
        </PanelIndexContext>
      ))}
    </div>
  );
};

interface TabsPanelProps extends Omit<React.ComponentPropsWithRef<"div">, "id"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const PanelIdContext = createContext<string | undefined>(undefined);
const PanelIndexContext = createContext<number>(0);

const getPanelId = (id: string | undefined) => (id ? `tab-panel${id}` : undefined);

const TabsPanel = ({ children, asChild, className, ...props }: TabsPanelProps) => {
  const id = use(PanelIdContext);
  const index = use(PanelIndexContext);
  const { selectedTab, selectedIndex } = useTabsContext();
  const Comp = asChild ? Slot : "div";

  // Match by id once tabs have registered themselves; fall back to index for the
  // initial render before useLayoutEffect runs (SSR + first client render).
  const isSelected = id !== undefined ? selectedTab === id : index === selectedIndex;

  return (
    <Comp
      id={getPanelId(id)}
      role="tabpanel"
      className={cn("outline-none", className)}
      aria-labelledby={getItemId(id)}
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
