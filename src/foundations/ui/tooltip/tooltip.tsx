"use client";

import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingDelayGroup,
  hide,
  offset as offsetMiddleware,
  Placement,
  safePolygon,
  useDelayGroup,
  useDismiss,
  useFloating,
  UseFloatingOptions,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  isValidElement,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { useTopLayer } from "@/foundations/hooks/use-top-layer/use-top-layer";
import { cn } from "@/lib/utils";

// Let's keep an eye on popover="hint", it might be able to handle the tooltip logic natively
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#using_hint_popover_state

const DEFAULT_DELAY_IN = 600;
const DEFAULT_DELAY_OUT = 0;
const ARROW_HEIGHT = 4;
const ARROW_WIDTH = 8;
const DEFAULT_GROUP_TIMEOUT_MS = 150;

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  context: ReturnType<typeof useFloating>["context"];
  floating: ReturnType<typeof useFloating>;
  interactions: ReturnType<typeof useInteractions>;
  isMounted: boolean;
  status: "unmounted" | "initial" | "open" | "close";
  arrowRef: RefObject<SVGSVGElement | null>;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip");
  }
  return context;
};

interface TooltipProps {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: UseFloatingOptions["onOpenChange"];
  placement?: Placement;
  offset?: number;
  delayIn?: number;
  delayOut?: number;
  disabled?: boolean;
  persistOnClick?: boolean;
  children: React.ReactNode;
}

/**
 * Tooltip root component
 *
 * @example
 * ```
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>Hover me</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Tooltip content</TooltipContent>
 * </Tooltip>
 * ```
 */
const Tooltip = ({
  children,
  initialOpen = false,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  placement = "top",
  offset = 4,
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  disabled = false,
  persistOnClick = false,
}: TooltipProps) => {
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
    whileElementsMounted: autoUpdate,
    middleware: [
      flip({ fallbackAxisSideDirection: "start", padding: offset * 2 }),
      offsetMiddleware(offset + ARROW_HEIGHT),
      arrow({ element: arrowRef, padding: 8 }),
      hide(),
    ],
  });

  const ctx = floating.context;
  const { delay: groupDelay } = useDelayGroup(ctx);

  const hover = useHover(ctx, {
    enabled: !disabled,
    move: false,
    delay: {
      open: typeof groupDelay === "object" ? groupDelay.open : delayIn,
      close: typeof groupDelay === "object" ? groupDelay.close : delayOut,
    },
    handleClose: safePolygon({}),
  });

  const focus = useFocus(ctx, {
    enabled: !disabled,
  });
  const dismiss = useDismiss(ctx, {
    referencePress: !persistOnClick,
  });
  const role = useRole(ctx, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  const { isMounted, status } = useTransitionStatus(ctx, { duration: 0 });

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        context: ctx,
        floating,
        interactions,
        isMounted,
        status,
        arrowRef,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps extends React.ComponentPropsWithRef<"span"> {
  asChild?: boolean;
  children: React.ReactNode;
}

const TooltipTrigger = ({
  asChild = false,
  children,
  ...props
}: TooltipTriggerProps) => {
  const { context, interactions } = useTooltipContext();

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      interactions.getReferenceProps({
        ref: context.refs.setReference,
        ...props,
      })
    );
  }

  return (
    <span
      ref={context.refs.setReference}
      {...interactions.getReferenceProps(props)}
      className={cn("inline-block outline-none", props.className)}
    >
      {children}
    </span>
  );
};

interface TooltipContentProps extends React.ComponentPropsWithRef<"div"> {
  children: React.ReactNode;
}

const TooltipContent = ({
  ref,
  children,
  className,
  ...props
}: TooltipContentProps) => {
  const { context, floating, interactions, isMounted, status, arrowRef } =
    useTooltipContext();

  const topLayerRef = useTopLayer<HTMLDivElement>(isMounted);
  const contentRef = useMergeRefs([context.refs.setFloating, ref, topLayerRef]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "bg-foreground text-background ease-out-quint z-50 max-w-80 overflow-visible rounded-lg px-3 py-1.5 text-xs break-words drop-shadow-md transition duration-300",
        "data-[state=closed]:data-[side=bottom]:-translate-y-2 data-[state=closed]:data-[side=left]:translate-x-2 data-[state=closed]:data-[side=right]:-translate-x-2 data-[state=closed]:data-[side=top]:translate-y-2",
        "data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
        "data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:scale-100",
        floating.middlewareData.hide?.referenceHidden && "hidden",
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
      {...interactions.getFloatingProps(props)}
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
 * <TooltipGroup>
 *   <div className="flex gap-2">
 *     {tools.map((tool) => (
 *       <Tooltip key={tool.id}>
 *         <TooltipTrigger asChild>
 *           <Button>{tool.icon}</Button>
 *         </TooltipTrigger>
 *         <TooltipContent>{tool.label}</TooltipContent>
 *       </Tooltip>
 *     ))}
 *   </div>
 * </TooltipGroup>
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

export { Tooltip, TooltipContent, TooltipGroup, TooltipTrigger };
