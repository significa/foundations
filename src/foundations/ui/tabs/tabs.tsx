"use client";

import { motion } from "motion/react";
import {
  Children,
  createContext,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useId,
  use,
} from "react";
import { Slot } from "@/foundations/components/slot/slot";

import { cn } from "@/lib/utils";

interface TabsContextValue {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  next: () => void;
  previous: () => void;
  orientation: "horizontal" | "vertical";
  registerTab: (id: string) => () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = use(TabsContext);
  if (!context)
    throw new Error("TabsContext must be used within a Tabs component");
  return context;
};

interface TabsProps
  extends Omit<React.ComponentPropsWithRef<"div">, "onChange"> {
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  orientation?: TabsContextValue["orientation"];
  children: React.ReactNode;
}

const Tabs = ({
  defaultIndex,
  selectedIndex: selectedIndexProp,
  onChange: onChangeProp,
  orientation = "horizontal",
  children,
  ...props
}: TabsProps) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(
    defaultIndex ?? 0
  );
  const [tabs, setTabs] = useState<string[]>([]);

  const selectedIndex = selectedIndexProp ?? internalSelectedIndex;

  const setSelectedIndex = useCallback(
    (index: number) => {
      setInternalSelectedIndex(index);
      onChangeProp?.(index);

      // focus on the selected tab when changing index
      const selectedTab = document.getElementById(getItemId(tabs[index]));
      selectedTab?.focus();
    },
    [onChangeProp, tabs]
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
    [tabs, setSelectedIndex]
  );

  const ctx = useMemo(
    () => ({
      tabs,
      selectedTab,
      setSelectedTab,
      next,
      previous,
      orientation,
      registerTab,
    }),
    [
      tabs,
      selectedTab,
      setSelectedTab,
      next,
      previous,
      orientation,
      registerTab,
    ]
  );

  return (
    <TabsContext value={ctx}>
      <div {...props}>{children}</div>
    </TabsContext>
  );
};

interface TabsItemsProps
  extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
  children: React.ReactNode;
}

const TabsItems = ({ children, className, ...props }: TabsItemsProps) => {
  const { orientation } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex gap-1.5",
        orientation === "horizontal"
          ? "items-center pb-4"
          : "flex-col items-start pr-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsItemProps
  extends Omit<
    React.ComponentPropsWithRef<"button">,
    "id" | "type" | "disabled"
  > {
  children: React.ReactNode;
  asChild?: boolean;
}

const getItemId = (id: string) => `tab${id}`;

const TabsItem = ({
  children,
  asChild,
  onClick,
  onKeyDown,
  className,
  ...props
}: TabsItemProps) => {
  const id = useId();
  const {
    selectedTab,
    setSelectedTab,
    registerTab,
    orientation,
    next,
    previous,
  } = useTabsContext();

  const Comp = asChild ? Slot : "button";

  useLayoutEffect(() => {
    registerTab(id);
  }, [id, registerTab]);

  const isSelected = selectedTab === id;

  const handleKeyboardNavigation = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
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
      type="button"
      className={cn(
        "ring-ring text-foreground/50 hover:text-foreground data-selected:text-foreground relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 transition outline-none focus-visible:ring-4",
        "[&>*:not([data-tab-indicator])]:z-10",
        className
      )}
      role="tab"
      aria-controls={getPanelId(id)}
      aria-selected={isSelected || undefined}
      data-selected={isSelected || undefined}
      tabIndex={isSelected ? 0 : -1}
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
      {isSelected && (
        <motion.span
          data-tab-indicator="true"
          layoutId="tab-indicator"
          aria-hidden="true"
          className="bg-muted absolute inset-0 z-0 rounded-xl"
          transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
        />
      )}
    </Comp>
  );
};

interface TabsPanelsProps
  extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
  children: React.ReactNode;
}

const TabsPanels = ({ children, className, ...props }: TabsPanelsProps) => {
  const { tabs } = useTabsContext();

  return (
    <div
      className={cn("ring-ring transition has-focus-visible:ring-4", className)}
      {...props}
    >
      {Children.map(children, (child, index) => (
        <PanelIdContext value={tabs[index]}>{child}</PanelIdContext>
      ))}
    </div>
  );
};

interface TabsPanelProps
  extends Omit<React.ComponentPropsWithRef<"div">, "id"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const PanelIdContext = createContext<string>("");

const getPanelId = (id: string) => `tab-panel${id}`;

const TabsPanel = ({
  children,
  asChild,
  className,
  ...props
}: TabsPanelProps) => {
  const id = use(PanelIdContext);
  const { selectedTab } = useTabsContext();
  const Comp = asChild ? Slot : "div";

  const isSelected = selectedTab === id;

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

export { Tabs, TabsItems, TabsItem, TabsPanels, TabsPanel };
