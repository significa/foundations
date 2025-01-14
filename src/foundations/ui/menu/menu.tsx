"use client";

import {
  createContext,
  useCallback,
  use,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FloatingList,
  useClick,
  useDismiss,
  useInteractions,
  UseInteractionsReturn,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverContext,
  PopoverEmpty,
  PopoverSearchInput,
  PopoverTrigger,
  usePopoverContext,
  usePopoverFloating,
} from "@/foundations/ui/popover/popover";
import { Divider } from "@/foundations/ui/divider/divider";
import { useStableCallback } from "@/foundations/hooks/use-stable-callback/use-stable-callback";
import { Slot } from "@radix-ui/react-slot";

type Item = {
  id: string;
  label: string;
  onSelect?: (e: { preventDefault: () => void }) => void;
};

type Items = Record<string, Item>;

interface MenuContextType {
  elementsRef: React.RefObject<(HTMLElement | null)[]>;
  labelsRef: React.RefObject<string[]>;
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  searchInputRef: HTMLInputElement | null;
  setSearchInputRef: (el: HTMLInputElement) => void;
  getItemProps: UseInteractionsReturn["getItemProps"];
  items: Items;
  registerItem: (item: Item) => () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

const useMenuContext = () => {
  const context = use(MenuContext);

  if (context == null) {
    throw new Error("Menu components must be wrapped in <Menu />");
  }

  return context;
};

const Menu = ({
  children,
  modal = true,
  placement = "bottom-start",
  ...props
}: React.ComponentProps<typeof Popover>) => {
  const floating = usePopoverFloating({ placement, ...props });

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const [items, setItems] = useState<Items>({});
  const labelsRef = useRef<string[]>([]);

  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(
    null
  );

  useEffect(() => {
    labelsRef.current = Object.values(items).map((item) => item.label);
  }, [items]);

  const registerItem = useCallback((item: Item) => {
    setItems((prev) => ({ ...prev, [item.id]: item }));

    return () => {
      setItems((prev) => {
        delete prev[item.id];
        return prev;
      });
    };
  }, []);

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context);

  const listNav = useListNavigation(floating.context, {
    listRef: elementsRef,
    activeIndex: highlightedIndex,
    onNavigate: setHighlightedIndex,
    virtual: !!searchInputRef || undefined,
  });

  const typeahead = useTypeahead(floating.context, {
    enabled: !searchInputRef,
    listRef: labelsRef,
    activeIndex: highlightedIndex,
    onMatch: setHighlightedIndex,
  });

  const interactions = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead,
  ]);

  const popoverContextValue = useMemo(
    () => ({
      ...floating,
      ...interactions,
      modal,
    }),
    [floating, interactions, modal]
  );

  const menuContextValue = useMemo(
    () => ({
      elementsRef,
      labelsRef,
      highlightedIndex,
      setHighlightedIndex,
      searchInputRef,
      setSearchInputRef,
      getItemProps: interactions.getItemProps,
      registerItem,
      items,
    }),
    [
      elementsRef,
      labelsRef,
      highlightedIndex,
      searchInputRef,
      interactions,
      registerItem,
      items,
    ]
  );

  return (
    <PopoverContext value={popoverContextValue}>
      <MenuContext value={menuContextValue}>{children}</MenuContext>
    </PopoverContext>
  );
};

const MenuTrigger = PopoverTrigger;

const MenuItems = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) => {
  const { elementsRef } = useMenuContext();

  return (
    <PopoverContent
      className={cn("flex flex-col items-stretch p-0", className)}
      {...props}
    >
      <FloatingList elementsRef={elementsRef}>{children}</FloatingList>
    </PopoverContent>
  );
};

interface MenuItemProps extends React.ComponentPropsWithRef<"button"> {
  onSelect?: Item["onSelect"];
  asChild?: boolean;
}

const MenuItem = ({
  ref: refProp,
  children,
  className,
  disabled,
  onClick,
  onSelect,
  onKeyDown,
  asChild,
  ...props
}: MenuItemProps) => {
  const itemId = useId();
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const {
    registerItem,
    highlightedIndex,
    getItemProps,
    items,
    searchInputRef,
    elementsRef,
  } = useMenuContext();
  const popoverCtx = usePopoverContext();
  const stableOnSelect = useStableCallback(onSelect);

  const { ref: listItemRef, index } = useListItem();

  const ref = useMergeRefs([listItemRef, refProp, innerRef]);

  const isHighlighted = highlightedIndex === index;

  const Comp = asChild ? Slot : "button";

  useLayoutEffect(() => {
    const text = innerRef.current?.textContent;

    if (!text) return;

    const unregister = registerItem({
      id: itemId,
      label: text,
      onSelect: stableOnSelect,
    });

    return unregister;
  }, [registerItem, itemId, stableOnSelect]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    stableOnSelect?.(e);
    onClick?.(e);

    if (!e.defaultPrevented) {
      popoverCtx.setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && highlightedIndex !== null) {
      // we are using elementsRef to preserve DOM order
      // certain items can be unmounted and registered again in a wrong position
      // elementsRef preserves the correct order
      const id = elementsRef.current[highlightedIndex]?.dataset.itemId;
      if (id) items[id]?.onSelect?.(e);
    } else if (searchInputRef) {
      searchInputRef.focus();
    }

    onKeyDown?.(e);
  };

  return (
    <Comp
      ref={ref}
      data-item-id={itemId}
      data-highlighted={isHighlighted || undefined}
      tabIndex={isHighlighted ? 0 : -1}
      disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "data-highlighted:bg-background-secondary text-foreground/80 relative mx-1 flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-base font-medium outline-none select-none first:mt-1 last:mb-1 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...getItemProps({
        ...props,
        onKeyDown: handleKeyDown,
        onClick: handleClick,
      })}
    >
      {children}
    </Comp>
  );
};

interface MenuSectionContextType {
  setTitleId: (id: string) => void;
}

const MenuSectionContext = createContext<MenuSectionContextType | null>(null);

const MenuSection = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const [titleId, setTitleId] = useState<string | undefined>(undefined);

  return (
    <MenuSectionContext value={{ setTitleId }}>
      <div
        role="group"
        aria-labelledby={titleId}
        className={cn(
          "border-border flex flex-col items-stretch not-first:border-t",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MenuSectionContext>
  );
};

const MenuHeading = ({
  children,
  id: propsId,
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const generatedId = useId();
  const id = propsId ?? generatedId;
  const ctx = use(MenuSectionContext);

  useLayoutEffect(() => {
    if (ctx) ctx.setTitleId(id);
  }, [ctx, id]);

  return (
    <div
      className={cn(
        "text-foreground-secondary px-3.5 pt-3 pb-1 text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const MenuDivider = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return <Divider className={cn("my-1", className)} {...props} />;
};

const MenuSearchInput = ({
  ref: refProp,
  onChange,
  onKeyDown,
  ...props
}: React.ComponentPropsWithRef<"input">) => {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const {
    highlightedIndex,
    setHighlightedIndex,
    items,
    setSearchInputRef,
    elementsRef,
  } = useMenuContext();

  const ref = useMergeRefs([refProp, internalRef]);

  useEffect(() => {
    if (internalRef.current) {
      setSearchInputRef(internalRef.current);
    }
  }, [setSearchInputRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && highlightedIndex !== null) {
      const id = elementsRef.current[highlightedIndex]?.dataset.itemId;
      if (id) items[id]?.onSelect?.(e);
    }

    onKeyDown?.(e);
  };

  return (
    <PopoverSearchInput
      ref={ref}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

const MenuEmpty = PopoverEmpty;

export {
  Menu,
  MenuTrigger,
  MenuItems,
  MenuItem,
  MenuDivider,
  MenuSection,
  MenuHeading,
  MenuSearchInput,
  MenuEmpty,
};
