"use client";

import type {
  Placement,
  UseFloatingOptions,
  UseInteractionsReturn,
} from "@floating-ui/react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingDelayGroup,
  hide,
  offset as offsetMiddleware,
  safePolygon,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { useTopLayer } from "@/foundations/hooks/use-top-layer/use-top-layer";
import { cn } from "@/lib/utils";

// Let's keep an eye on popover="hint", it might be able to handle the tooltip logic natively
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#using_hint_popover_state

const DEFAULT_DELAY_IN = 600;
const DEFAULT_DELAY_OUT = 0;
const ARROW_HEIGHT = 4;
const ARROW_WIDTH = 8;
const DEFAULT_GROUP_TIMEOUT_MS = 150;

interface UseTooltipFloatingOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: UseFloatingOptions["onOpenChange"];
  placement?: Placement;
  offset?: number;
  delayIn?: number;
  delayOut?: number;
  disabled?: boolean;
  persistOnClick?: boolean;
}

const useTooltipFloating = ({
  initialOpen = false,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  placement = "top",
  offset = 4,
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  disabled = false,
  persistOnClick = false,
}: UseTooltipFloatingOptions) => {
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(initialOpen);

  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback<NonNullable<UseFloatingOptions["onOpenChange"]>>(
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
    whileElementsMounted: (...args) =>
      autoUpdate(...args, {
        elementResize: true,
        layoutShift: true,
      }),
    middleware: [
      flip({ fallbackAxisSideDirection: "start", padding: offset * 2 }),
      offsetMiddleware(offset + ARROW_HEIGHT),
      arrow({ element: arrowRef, padding: 8 }),
      hide(),
    ],
  });

  return useMemo(
    () => ({
      open,
      setOpen,
      arrowRef,
      delayIn,
      delayOut,
      disabled,
      persistOnClick,
      ...floating,
    }),
    [
      open,
      setOpen,
      arrowRef,
      delayIn,
      delayOut,
      disabled,
      persistOnClick,
      floating,
    ]
  );
};

// Context

interface TooltipContextType
  extends ReturnType<typeof useTooltipFloating>,
    UseInteractionsReturn {}

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const context = use(TooltipContext);

  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

// Components

interface TooltipProps extends UseTooltipFloatingOptions {
  children: React.ReactNode;
}

/**
 * Tooltip component
 *
 * @example
 * ```
 * <Tooltip>
 *   <Tooltip.Trigger asChild>
 *     <Button>Hover me</Button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Content>Tooltip content</Tooltip.Content>
 * </Tooltip>
 * ```
 */
const Tooltip = ({ children, ...props }: TooltipProps) => {
  const floating = useTooltipFloating(props);

  const ctx = floating.context;
  const { delay: groupDelay } = useDelayGroup(ctx);

  const hover = useHover(ctx, {
    enabled: !floating.disabled,
    move: false,
    delay: {
      open: typeof groupDelay === "object" ? groupDelay.open : floating.delayIn,
      close:
        typeof groupDelay === "object" ? groupDelay.close : floating.delayOut,
    },
    handleClose: safePolygon({}),
  });

  const focus = useFocus(ctx, {
    enabled: !floating.disabled,
  });
  const dismiss = useDismiss(ctx, {
    referencePress: !floating.persistOnClick,
  });
  const role = useRole(ctx, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  const tooltipContextValue = useMemo(
    () => ({
      ...floating,
      ...interactions,
    }),
    [floating, interactions]
  );

  return (
    <TooltipContext value={tooltipContextValue}>{children}</TooltipContext>
  );
};

interface TooltipTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

/**
 * Will show the tooltip when hovered or focused.
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <Tooltip.Trigger asChild>
 *   <Button>Hover me</Button>
 * </Tooltip.Trigger>
 * ```
 */
const TooltipTrigger = ({
  ref: refProp,
  children,
  asChild = false,
  ...props
}: TooltipTriggerProps) => {
  const context = useTooltipContext();
  const Comp = asChild ? Slot : "button";

  const ref = useMergeRefs([context.refs.setReference, refProp]);

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </Comp>
  );
};

/**
 * Will render the tooltip content.
 *
 * @example
 * ```
 * <Tooltip.Content>
 *   Tooltip text here
 * </Tooltip.Content>
 * ```
 */
const TooltipContent = ({
  ref: refProp,
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const { context, refs, arrowRef, getFloatingProps } = useTooltipContext();

  const { isMounted, status } = useTransitionStatus(context, { duration: 0 });

  const topLayerRef = useTopLayer<HTMLDivElement>(isMounted);
  const ref = useMergeRefs([refs.setFloating, refProp, topLayerRef]);

  if (!isMounted) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "bg-foreground text-background ease-out-quint z-50 max-w-80 overflow-visible rounded-lg px-3 py-1.5 text-xs break-words whitespace-normal drop-shadow-md transition duration-300",
        "data-[state=closed]:data-[side=bottom]:-translate-y-2 data-[state=closed]:data-[side=left]:translate-x-2 data-[state=closed]:data-[side=right]:-translate-x-2 data-[state=closed]:data-[side=top]:translate-y-2",
        "data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
        "data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:scale-100",
        context.middlewareData.hide?.referenceHidden && "hidden",
        className
      )}
      data-state={status === "open" ? "open" : "closed"}
      data-side={context.placement.split("-")[0]}
      style={{
        position: context.strategy,
        top: context.y ?? 0,
        left: context.x ?? 0,
        ...props.style,
      }}
      {...getFloatingProps(props)}
    >
      <FloatingArrow
        ref={arrowRef}
        context={context}
        className="fill-foreground"
        tipRadius={1}
        height={ARROW_HEIGHT}
        width={ARROW_WIDTH}
      />
      {children}
    </div>
  );
};

interface TooltipGroupProps {
  children: React.ReactNode;
  delayIn?: number;
  delayOut?: number;
  timeoutMs?: number;
}

/**
 * TooltipGroup allows you to group tooltips so they won't have delay when you move between them.
 *
 * This is very useful for navigation or toolbars where you want the first tooltip to have significant delay but moving to the next item should be instant so the user can scan all options.
 *
 * @example
 * ```
 * <Tooltip.Group>
 *   <div className="flex gap-2">
 *     {tools.map((tool) => (
 *       <Tooltip key={tool.id}>
 *         <Tooltip.Trigger asChild>
 *           <Button>{tool.icon}</Button>
 *         </Tooltip.Trigger>
 *         <Tooltip.Content>{tool.label}</Tooltip.Content>
 *       </Tooltip>
 *     ))}
 *   </div>
 * </Tooltip.Group>
 * ```
 */

const TooltipGroup = ({
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  timeoutMs = DEFAULT_GROUP_TIMEOUT_MS,
  children,
}: TooltipGroupProps) => {
  return (
    <FloatingDelayGroup
      delay={{ open: delayIn, close: delayOut }}
      timeoutMs={timeoutMs}
    >
      {children}
    </FloatingDelayGroup>
  );
};

export {
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
  useTooltipContext,
};
