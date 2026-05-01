import {
  FloatingList,
  FloatingNode,
  FloatingTree,
  safePolygon,
  type UseInteractionsReturn,
  useClick,
  useDismiss,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';
import {
  createContext,
  Fragment,
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Slot } from '@/foundations/components/slot/slot';
import { useStableCallback } from '@/foundations/hooks/use-stable-callback/use-stable-callback';
import { Divider } from '@/foundations/ui/divider/divider';
import {
  Popover,
  PopoverContext,
  type PopoverOrigin,
  usePopoverContext,
  usePopoverFloating,
} from '@/foundations/ui/popover/popover';
import { cn, cva } from '@/lib/utils/classnames';

const HOVER_OPEN_DELAY = 75;
const HOVER_CLOSE_DELAY = 150;

type Item = {
  id: string;
  label: string;
  onSelect?: (e: { preventDefault: () => void }) => void;
};

type Items = Record<string, Item>;

interface MenuContextType {
  parent: MenuContextType | null;
  isNested: boolean;
  elementsRef: React.RefObject<(HTMLElement | null)[]>;
  highlightedIndex: number | null;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  searchInputRef: HTMLInputElement | null;
  setSearchInputRef: (el: HTMLInputElement) => void;
  items: Items;
  registerItem: (item: Item) => () => void;
  getItemProps: UseInteractionsReturn['getItemProps'];
}

const MenuContext = createContext<MenuContextType | null>(null);

const useMenuContext = () => {
  const context = use(MenuContext);

  if (context == null) {
    throw new Error('Menu components must be wrapped in <Menu />');
  }

  return context;
};

interface MenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: React.ComponentProps<typeof Popover>['placement'];
  offset?: number;
  origin?: PopoverOrigin;
  modal?: boolean;
  children?: React.ReactNode;
}

/**
 * Menu is a list of actions presented in a floating panel. Supports nested
 * submenus by rendering a `<Menu>` inside another menu's items, with the inner
 * menu's trigger being a `<Menu.ItemTrigger>`.
 *
 * @example
 * ```
 * <Menu>
 *   <Menu.Trigger asChild>
 *     <Button>Open</Button>
 *   </Menu.Trigger>
 *   <Menu.Items>
 *     <Menu.Item onSelect={...}>New file</Menu.Item>
 *     <Menu>
 *       <Menu.ItemTrigger>More options</Menu.ItemTrigger>
 *       <Menu.Items>
 *         <Menu.Item onSelect={...}>Sub-action</Menu.Item>
 *       </Menu.Items>
 *     </Menu>
 *   </Menu.Items>
 * </Menu>
 * ```
 */
const Menu = (props: MenuProps) => {
  const parentId = useFloatingParentNodeId();
  // The root menu wraps its descendants in a FloatingTree so submenus can
  // coordinate (sibling close, tree-wide click). Nested menus are already
  // inside the tree from the root, so they render as a Fragment.
  const Container = parentId === null ? FloatingTree : Fragment;

  return (
    <Container>
      <MenuRoot {...props} />
    </Container>
  );
};

const MenuRoot = ({
  children,
  modal = true,
  placement: propPlacement,
  ...props
}: MenuProps) => {
  const parent = use(MenuContext);
  const parentId = useFloatingParentNodeId();
  const isNested = !!parentId;

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
        const { [item.id]: _, ...rest } = prev;
        return rest;
      });
    };
  }, []);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();

  const floating = usePopoverFloating({
    nodeId,
    placement: propPlacement ?? (isNested ? 'right-start' : 'bottom-start'),
    offset: isNested ? -4 : 4,
    ...props,
  });

  // Hover-to-open is only meaningful for nested menus. safePolygon avoids
  // closing the menu when the cursor briefly leaves the trigger to traverse
  // toward the submenu.
  const hover = useHover(floating.context, {
    enabled: isNested,
    delay: { open: HOVER_OPEN_DELAY, close: HOVER_CLOSE_DELAY },
    handleClose: safePolygon({ blockPointerEvents: true }),
    mouseOnly: true,
  });

  const click = useClick(floating.context, {
    event: 'click',
    ignoreMouse: isNested,
    toggle: !isNested,
  });

  const role = useRole(floating.context, { role: 'menu' });
  const dismiss = useDismiss(floating.context, { bubbles: true });

  const listNavigation = useListNavigation(floating.context, {
    listRef: elementsRef,
    activeIndex: highlightedIndex,
    nested: isNested,
    onNavigate: setHighlightedIndex,
    virtual: !!searchInputRef,
  });

  const isSingleNodeMenu = tree?.nodesRef.current.length === 1;
  const typeahead = useTypeahead(floating.context, {
    // Disable typeahead when a search input is present (the input handles
    // filtering) or in nested menus / multi-node trees (avoids hijacking
    // letter keys that should reach a parent's search).
    enabled: !searchInputRef && !isNested && isSingleNodeMenu,
    listRef: labelsRef,
    activeIndex: highlightedIndex,
    onMatch: setHighlightedIndex,
  });

  const interactions = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  // Tree-wide coordination:
  // - 'click' closes every menu in the tree when any item is selected.
  // - 'menuopen' lets siblings (same parent, different node) close themselves
  //   when another submenu opens.
  useEffect(() => {
    if (!tree) return;

    const onTreeClick = () => floating.setOpen(false);
    const onSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        floating.setOpen(false);
      }
    };

    tree.events.on('click', onTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    return () => {
      tree.events.off('click', onTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId, floating]);

  useEffect(() => {
    if (floating.open && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, nodeId, parentId, floating.open]);

  const popoverContextValue = useMemo(
    () => ({
      ...floating,
      ...interactions,
      modal,
    }),
    [floating, interactions, modal]
  );

  const menuContextValue = useMemo<MenuContextType>(
    () => ({
      parent,
      isNested,
      elementsRef,
      highlightedIndex,
      setHighlightedIndex,
      searchInputRef,
      setSearchInputRef,
      items,
      registerItem,
      getItemProps: interactions.getItemProps,
    }),
    [
      parent,
      isNested,
      highlightedIndex,
      searchInputRef,
      items,
      registerItem,
      interactions.getItemProps,
    ]
  );

  return (
    <FloatingNode id={nodeId}>
      <PopoverContext value={popoverContextValue}>
        <MenuContext value={menuContextValue}>{children}</MenuContext>
      </PopoverContext>
    </FloatingNode>
  );
};

interface MenuTriggerProps extends React.ComponentPropsWithRef<'button'> {
  asChild?: boolean;
}

/**
 * The trigger element that opens the menu. For root menus this is the entry
 * point users click. For nested menus, prefer `<Menu.ItemTrigger>` which
 * styles it as a menu item with a chevron.
 */
const MenuTrigger = ({
  ref: refProp,
  asChild,
  children,
  className,
  ...props
}: MenuTriggerProps) => {
  const popover = usePopoverContext();
  const { isNested, parent } = useMenuContext();
  const item = useListItem();

  const ref = useMergeRefs([popover.refs.setReference, item.ref, refProp]);

  const isHighlighted = parent?.highlightedIndex === item.index;
  const Comp = asChild ? Slot : 'button';

  // When nested, the trigger is also an item of the parent menu — so it must
  // pick up parent's getItemProps for keyboard nav and registration.
  const referenceProps = popover.getReferenceProps(
    isNested ? parent?.getItemProps(props) : props
  );

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      className={cn(!asChild && 'disabled:opacity-40', className)}
      tabIndex={isNested ? (isHighlighted ? 0 : -1) : 0}
      data-state={popover.open ? 'open' : 'closed'}
      data-highlighted={isHighlighted || undefined}
      {...referenceProps}
    >
      {children}
    </Comp>
  );
};

const itemTriggerStyle = cva({
  base: [
    'relative mx-(--inset) flex w-[calc(100%-calc(var(--inset)*2))] cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-1.5',
    'font-medium text-base text-foreground/80 outline-none',
    'first-of-type:mt-(--inset) last-of-type:mb-(--inset)',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    'data-[state=open]:bg-background-secondary data-highlighted:bg-background-secondary',
  ],
});

/**
 * A menu item that opens a nested submenu. Must be used inside a nested
 * `<Menu>` (i.e. one rendered as a child of `<Menu.Items>`).
 */
const MenuItemTrigger = ({
  children,
  className,
  ...props
}: MenuTriggerProps) => {
  const { parent } = useMenuContext();

  if (!parent) {
    throw new Error(
      '<Menu.ItemTrigger> must be rendered inside a nested <Menu>.'
    );
  }

  return (
    <MenuTrigger asChild {...props}>
      <button
        type="button"
        role="menuitem"
        className={itemTriggerStyle({ className })}
      >
        {children}
        <CaretRightIcon className="ml-auto text-foreground-secondary" />
      </button>
    </MenuTrigger>
  );
};

interface MenuItemsProps extends React.ComponentPropsWithRef<'div'> {
  /**
   * Drop the floating panel and just render the items inline. Use this when
   * something else owns the surface — a Dialog for a command palette, a
   * Drawer for a mobile menu, a card for embedded actions. You keep all of
   * Menu's keyboard nav, search, and item registration; you just don't get
   * the popover.
   */
  inline?: boolean;
}

const MenuItems = ({
  ref: refProp,
  children,
  className,
  inline,
  ...props
}: MenuItemsProps) => {
  const popover = usePopoverContext();
  const { isNested, elementsRef } = useMenuContext();

  const ref = useMergeRefs([popover.refs.setFloating, refProp]);

  if (inline) {
    return (
      <FloatingList elementsRef={elementsRef}>
        <div
          ref={ref}
          className={cn('font-medium text-foreground outline-none', className)}
          {...popover.getFloatingProps(props)}
        >
          {children}
        </div>
      </FloatingList>
    );
  }

  return (
    <FloatingList elementsRef={elementsRef}>
      <Popover.Panel
        ref={ref}
        context={popover.context}
        modal={popover.modal}
        isPositioned={popover.isPositioned}
        initialFocus={isNested ? -1 : 0}
        returnFocus={!isNested}
        animate={!isNested}
        className={cn(
          'z-50 max-h-(--max-height) w-56 overflow-auto rounded-xl border border-border bg-background font-medium text-foreground shadow-lg outline-none scroll-py-(--inset)',
          className
        )}
        {...popover.getFloatingProps(props)}
      >
        {children}
      </Popover.Panel>
    </FloatingList>
  );
};

const itemStyle = cva({
  base: [
    'relative mx-(--inset) flex w-[calc(100%-calc(var(--inset)*2))] cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-1.5',
    'font-medium text-base outline-none',
    'first-of-type:mt-(--inset) last-of-type:mb-(--inset)',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  variants: {
    variant: {
      default: 'text-foreground/80 data-highlighted:bg-background-secondary',
      destructive: 'text-error data-highlighted:bg-error/10',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface MenuItemProps extends React.ComponentPropsWithRef<'button'> {
  onSelect?: Item['onSelect'];
  asChild?: boolean;
  variant?: 'default' | 'destructive';
}

const MenuItem = ({
  ref: refProp,
  children,
  className,
  disabled,
  variant,
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
  const tree = useFloatingTree();
  const stableOnSelect = useStableCallback(onSelect);

  const { ref: listItemRef, index } = useListItem();
  const ref = useMergeRefs([listItemRef, refProp, innerRef]);

  const isHighlighted = highlightedIndex === index;
  const Comp = asChild ? Slot : 'button';

  useLayoutEffect(() => {
    const text = innerRef.current?.textContent;
    if (!text) return;

    return registerItem({
      id: itemId,
      label: text,
      onSelect: stableOnSelect,
    });
  }, [registerItem, itemId, stableOnSelect]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    stableOnSelect?.(e);
    if (e.defaultPrevented) return;

    // Close every menu in the tree (root + any open submenus).
    if (tree) {
      tree.events.emit('click');
    } else {
      popoverCtx.setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (e.key === 'Enter' && highlightedIndex !== null) {
      // Look up the item by DOM order — `items` is a record and may be in
      // registration order rather than rendered order.
      const id = elementsRef.current[highlightedIndex]?.dataset.itemId;
      if (id) items[id]?.onSelect?.(e);
    } else if (searchInputRef) {
      // Forward letter/text keys to the search input so users can keep typing
      // after navigating with arrow keys.
      searchInputRef.focus();
    }
  };

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      role="menuitem"
      data-item-id={itemId}
      data-highlighted={isHighlighted || undefined}
      tabIndex={isHighlighted ? 0 : -1}
      disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      className={itemStyle({ variant, className })}
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
}: React.ComponentPropsWithRef<'div'>) => {
  const [titleId, setTitleId] = useState<string | undefined>(undefined);

  return (
    <MenuSectionContext value={{ setTitleId }}>
      {/** biome-ignore lint/a11y/useSemanticElements: maintain div */}
      <div
        role="group"
        aria-labelledby={titleId}
        className={cn(
          'flex flex-col items-stretch border-border not-first:border-t',
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
}: React.ComponentPropsWithRef<'div'>) => {
  const generatedId = useId();
  const id = propsId ?? generatedId;
  const ctx = use(MenuSectionContext);

  useLayoutEffect(() => {
    if (ctx) ctx.setTitleId(id);
  }, [ctx, id]);

  return (
    <div
      id={id}
      className={cn(
        'px-3.5 pt-3 pb-1 font-medium text-foreground-secondary text-sm',
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
}: React.ComponentPropsWithRef<'div'>) => {
  return <Divider className={cn('my-(--inset)', className)} {...props} />;
};

const MenuSearchInput = ({
  ref: refProp,
  onChange,
  onKeyDown,
  ...props
}: React.ComponentPropsWithRef<'input'>) => {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const {
    highlightedIndex,
    setHighlightedIndex,
    items,
    setSearchInputRef,
    elementsRef,
  } = useMenuContext();
  const popoverCtx = usePopoverContext();
  const tree = useFloatingTree();

  const ref = useMergeRefs([refProp, internalRef]);

  useEffect(() => {
    if (internalRef.current) setSearchInputRef(internalRef.current);
  }, [setSearchInputRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && highlightedIndex !== null) {
      const id = elementsRef.current[highlightedIndex]?.dataset.itemId;
      if (id && items[id]) {
        items[id].onSelect?.(e);
        // Mirror MenuItem.handleClick: close the whole tree on selection
        // unless onSelect explicitly preventDefault'd.
        if (!e.defaultPrevented) {
          if (tree) {
            tree.events.emit('click');
          } else {
            popoverCtx.setOpen(false);
          }
        }
      }
    }
    onKeyDown?.(e);
  };

  return (
    <Popover.SearchInput
      ref={ref}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

const MenuEmpty = Popover.Empty;

const CompoundMenu = Object.assign(Menu, {
  Trigger: MenuTrigger,
  ItemTrigger: MenuItemTrigger,
  Items: MenuItems,
  Item: MenuItem,
  Section: MenuSection,
  Heading: MenuHeading,
  Divider: MenuDivider,
  SearchInput: MenuSearchInput,
  Empty: MenuEmpty,
});

const useMenuPopoverContext = usePopoverContext;

export { CompoundMenu as Menu, useMenuContext, useMenuPopoverContext };
