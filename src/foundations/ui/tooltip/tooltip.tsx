"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  FloatingDelayGroup,
  Placement,
  useFloating,
  UseFloatingOptions,
  arrow,
  useDelayGroup,
  useHover,
  safePolygon,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingArrow,
  useTransitionStatus,
  hide,
} from "@floating-ui/react";

import { cn } from "@/lib/utils";
import { useTopLayer } from "@/foundations/hooks/use-top-layer/use-top-layer";

// Let's keep an eye on popover="hint", it might be able to handle the tooltip logic natively
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#using_hint_popover_state

const DEFAULT_DELAY_IN = 600;
const DEFAULT_DELAY_OUT = 0;
const ARROW_HEIGHT = 4;
const ARROW_WIDTH = 8;
const DEFAULT_GROUP_TIMEOUT_MS = 150;

interface TooltipProps
  extends Omit<React.ComponentPropsWithRef<"div">, "content"> {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: UseFloatingOptions["onOpenChange"];
  placement?: Placement;
  offset?: number;
  delayIn?: number;
  delayOut?: number;
  disabled?: boolean;
  persistOnClick?: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Tooltip component
 *
 * @example
 * ```
 * <Tooltip content="Tooltip content">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
const Tooltip = ({
  ref,
  content,
  children,
  className,
  initialOpen = false,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  placement = "top",
  offset = 4,
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  disabled = false,
  persistOnClick = false,
  ...props
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

  const topLayerRef = useTopLayer<HTMLDivElement>(isMounted);
  const contentRef = useMergeRefs([ctx.refs.setFloating, ref, topLayerRef]);

  return (
    <>
      {isValidElement(children) ? (
        cloneElement(
          children,
          interactions.getReferenceProps({ ref: ctx.refs.setReference })
        )
      ) : (
        <span
          ref={ctx.refs.setReference}
          {...interactions.getReferenceProps(props)}
          className="inline-block outline-none"
        >
          {children}
        </span>
      )}
      {isMounted && (
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
          data-side={ctx.placement.split("-")[0]}
          style={{
            position: ctx.strategy,
            top: ctx.y ?? 0,
            left: ctx.x ?? 0,
            ...props.style,
          }}
          {...interactions.getFloatingProps(props)}
        >
          <FloatingArrow
            ref={arrowRef}
            context={ctx}
            className="fill-foreground"
            tipRadius={1}
            height={ARROW_HEIGHT}
            width={ARROW_WIDTH}
          />
          {content}
        </div>
      )}
    </>
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
 *       <Tooltip key={tool.id} content={tool.label}>
 *         <Button>{tool.icon}</Button>
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

export { Tooltip, TooltipGroup };
