'use client';

import {
  autoUpdate,
  type FloatingContext,
  FloatingFocusManager,
  flip,
  hide,
  offset as offsetMiddleware,
  type Placement,
  shift,
  size,
  type UseFloatingOptions,
  type UseInteractionsReturn,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { createContext, use, useCallback, useMemo, useState } from 'react';

import { Slot } from '@/foundations/components/slot/slot';
import { useTopLayer } from '@/foundations/hooks/use-top-layer/use-top-layer';
import { cn } from '@/lib/utils/classnames';

interface UsePopoverFloatingOptions {
  open?: boolean;
  onOpenChange?: UseFloatingOptions['onOpenChange'];
  placement?: Placement;
  offset?: number;
}

const usePopoverFloating = ({
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  placement = 'bottom',
  offset = 4,
}: UsePopoverFloatingOptions) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback<NonNullable<UseFloatingOptions['onOpenChange']>>(
    (open, event, reason) => {
      setInternalOpen(open);
      propsOnOpenChange?.(open, event, reason);
    },
    [propsOnOpenChange]
  );

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        layoutShift: false,
      }),
    middleware: [
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      offsetMiddleware(offset),
      size({
        apply({ rects, elements, availableHeight }) {
          elements.floating.style.setProperty(
            '--max-height',
            `${availableHeight}px`
          );

          elements.floating.style.setProperty(
            '--width',
            `${rects.reference.width}px`
          );
        },
        padding: 4,
      }),
      hide(),
    ],
  });

  return useMemo(
    () => ({
      open,
      setOpen,
      ...floating,
    }),
    [open, setOpen, floating]
  );
};

// Context

interface ContextType
  extends ReturnType<typeof usePopoverFloating>,
    UseInteractionsReturn {
  modal: boolean;
}

const PopoverContext = createContext<ContextType | null>(null);

const usePopoverContext = () => {
  const context = use(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

// Components

interface PopoverProps extends UsePopoverFloatingOptions {
  modal?: boolean;
  children: React.ReactNode;
}
/**
 * Popover allows you to open a floating panel that is attached to a trigger element.
 *
 * Set `modal` to `true` to focus trap the popover.
 *
 * @example
 * ```
 * <Popover>
 *   <Popover.Trigger>
 *     <Button>Open Popover</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <p>Popover Content</p>
 *   </Popover.Content>
 * </Popover>
 * ```
 */
const Popover = ({ children, modal = false, ...props }: PopoverProps) => {
  const floating = usePopoverFloating(props);

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context);

  const interactions = useInteractions([click, dismiss, role]);

  const popoverContextValue = useMemo(
    () => ({
      ...floating,
      ...interactions,
      modal,
    }),
    [floating, interactions, modal]
  );

  return (
    <PopoverContext value={popoverContextValue}>{children}</PopoverContext>
  );
};

interface PopoverTriggerProps extends React.ComponentPropsWithRef<'button'> {
  asChild?: boolean;
}

/**
 * Will open the popover when clicked.
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <Popover.Trigger>
 *   <Button>Open Popover</Button>
 * </Popover.Trigger>
 *
 * <Popover.Trigger asChild={false}>
 *   Open Popover
 * </Popover.Trigger>
 * ```
 */
const PopoverTrigger = ({
  ref: refProp,
  children,
  asChild = false,
  className,
  ...props
}: PopoverTriggerProps) => {
  const context = usePopoverContext();
  const Comp = asChild ? Slot : 'button';

  const ref = useMergeRefs([context.refs.setReference, refProp]);

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      className={cn(!asChild && 'disabled:opacity-40', className)}
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </Comp>
  );
};

/**
 * Will render the popover content.
 *
 * @example
 * ```
 * <Popover.Content>
 *   <p>Popover Content</p>
 * </Popover.Content>
 * ```
 */
const PopoverContent = ({
  ref: refProp,
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  const { context, refs, getFloatingProps, modal } = usePopoverContext();

  const ref = useMergeRefs([refs.setFloating, refProp]);

  return (
    <PopoverPanel
      context={context}
      modal={modal}
      ref={ref}
      className={cn(
        'z-50 max-h-(--max-height) w-72 overflow-auto rounded-xl border border-border bg-background p-3 font-medium text-foreground shadow-lg outline-none',
        className
      )}
      {...getFloatingProps(props)}
    >
      {children}
    </PopoverPanel>
  );
};

interface PopoverPanelProps extends React.ComponentPropsWithRef<'div'> {
  context: FloatingContext;
  modal?: boolean;
}

/**
 *
 * PopoverPanel is the actual floating panel that will be positioned relative to the trigger.
 * It's exported for internal purposes only, to avoid duplicating the logic of positioning and transitions.
 * It is not part of the public API as it is included already in the PopoverContent component.
 * @returns
 */
const PopoverPanel = ({
  ref,
  context,
  modal,
  className,
  style,
  ...props
}: PopoverPanelProps) => {
  const { isMounted, status } = useTransitionStatus(context, { duration: 150 });
  const topLayerRef = useTopLayer<HTMLDivElement>(isMounted);

  const mergedRef = useMergeRefs([ref, topLayerRef]);

  if (!isMounted) return null;

  return (
    <FloatingFocusManager context={context} modal={modal}>
      <div
        ref={mergedRef}
        data-state={['open', 'initial'].includes(status) ? 'open' : 'closed'}
        data-side={context.placement.split('-')[0]}
        className={cn(
          'origin-(--transform-origin) transition duration-300 ease-out',
          'data-[state=closed]:data-[side=left]:translate-x-2 data-[state=closed]:data-[side=right]:-translate-x-2 data-[state=closed]:data-[side=bottom]:-translate-y-2 data-[state=closed]:data-[side=top]:translate-y-2',
          'data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:duration-150',
          'data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:scale-100',
          className
        )}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          '--transform-origin': placementToTransformOrigin(context.placement),
          visibility: context.middlewareData.hide?.referenceHidden
            ? 'hidden'
            : 'visible',
          ...style,
        }}
        {...props}
      />
    </FloatingFocusManager>
  );
};

// ugly and verbose but easy to reason about and maintain
const placementToTransformOrigin = (placement: Placement) => {
  switch (placement) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top-start':
      return 'bottom left';
    case 'top-end':
      return 'bottom right';
    case 'bottom-start':
      return 'top left';
    case 'bottom-end':
      return 'top right';
    case 'left-start':
      return 'right top';
    case 'left-end':
      return 'right bottom';
    case 'right-start':
      return 'left top';
    case 'right-end':
      return 'left bottom';
  }
};

interface PopoverCloseProps extends React.ComponentPropsWithRef<'button'> {
  asChild?: boolean;
}

/**
 * Will close the popover when clicked.
 *
 * Useful to dismiss the popover from within (e.g.: popover with a form and a cancel button).
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <Popover>
 *   <Popover.Trigger>
 *     <Button>Open Popover</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <Popover.Close>
 *       <Button>Cancel</Button>
 *     </Popover.Close>
 *   </Popover.Content>
 * </Popover>
 * ```
 */
const PopoverClose = ({
  asChild = false,
  children,
  ...props
}: PopoverCloseProps) => {
  const { setOpen } = usePopoverContext();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      {...props}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
        setOpen(false);
      }}
    >
      {children}
    </Comp>
  );
};

const PopoverSearchInput = ({
  className,
  ...props
}: React.ComponentPropsWithRef<'input'>) => {
  return (
    <div className="relative flex items-center rounded-t-lg border-border border-b bg-transparent">
      <MagnifyingGlassIcon
        weight="bold"
        className="absolute left-4 size-4 shrink-0 text-foreground"
      />
      <input
        className={cn(
          'h-10 w-full border-0 bg-transparent p-4 pl-10 font-medium text-base outline-none transition-colors placeholder:text-foreground-secondary focus:ring-0',
          className
        )}
        {...props}
      />
    </div>
  );
};

const PopoverEmpty = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div
      className={cn(
        'my-4 text-center text-base text-foreground-secondary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CompoundPopover = Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
  SearchInput: PopoverSearchInput,
  Empty: PopoverEmpty,
  Panel: PopoverPanel,
});

export {
  CompoundPopover as Popover,
  PopoverContext,
  usePopoverContext,
  // internal use only
  usePopoverFloating,
};
