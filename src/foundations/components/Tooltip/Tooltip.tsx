import {
  FloatingArrow,
  FloatingArrowProps,
  FloatingDelayGroup,
  FloatingPortal,
  useMergeRefs,
  useTransitionStatus
} from '@floating-ui/react';
import {
  Children,
  cloneElement,
  createContext,
  FC,
  forwardRef,
  HTMLProps,
  isValidElement,
  useContext,
  useMemo
} from 'react';

import { cn } from '../../../lib/tailwind';

import { useTooltip, UseTooltipProps } from '../../hooks/useTooltip';
import {
  ARROW_HEIGHT,
  ARROW_WIDTH,
  DEFAULT_DELAY_IN,
  DEFAULT_DELAY_OUT
} from '../../hooks/useTooltip/constants';

const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

interface TooltipProps extends UseTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tooltip is the easy-to-use opinionated component for displaying content on hover.
 *
 * See TooltipPrimitive for more control over the tooltip.
 *
 * @example
 * ```
 * <Tooltip content="Hello world">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
const Tooltip: FC<TooltipProps> = ({ children, content, className, ...options }) => {
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={className}>
        <TooltipArrow />
        {content}
      </TooltipContent>
    </TooltipContext.Provider>
  );
};

interface TooltipRootProps extends UseTooltipProps {
  children: React.ReactNode;
}

const TooltipRoot: FC<TooltipRootProps> = ({ children, ...options }) => {
  const tooltipContent = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === TooltipContent
  );
  const hasArrow = useMemo(
    () =>
      isValidElement(tooltipContent) &&
      Children.toArray(tooltipContent.props.children).some(
        (child) => isValidElement(child) && child.type === TooltipArrow
      ),
    [tooltipContent]
  );

  const tooltip = useTooltip({
    ...options,
    withArrow: hasArrow
  });

  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
};

interface TooltipTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}

const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = false, className, ...props }, forwardedRef) => {
    const context = useTooltipContext();

    const childrenRef =
      asChild && isValidElement(children) && 'ref' in children
        ? (children.ref as React.RefObject<HTMLElement>)
        : undefined;

    const ref = useMergeRefs([context.refs.setReference, forwardedRef, childrenRef]);

    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed'
        })
      );
    }

    return (
      <span
        {...context.getReferenceProps({
          ref,
          ...props
        })}
        className={cn('inline-block outline-none', className)}
        data-state={context.open ? 'open' : 'closed'}
      >
        {children}
      </span>
    );
  }
);

TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function TooltipContent({ style, className, children, ...props }, forwardedRef) {
    const { context, getFloatingProps } = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, forwardedRef]);

    const { isMounted, status } = useTransitionStatus(context, {
      duration: 0
    });

    if (!isMounted) return null;

    return (
      <FloatingPortal>
        <div
          ref={ref}
          className={cn(
            'z-50 max-w-80 break-words rounded-lg bg-foreground px-3 py-1.5 text-xs text-background drop-shadow-md transition duration-300 ease-out-quint',
            'data-[state=closed]:data-[side=bottom]:-translate-y-2 data-[state=closed]:data-[side=left]:translate-x-2 data-[state=closed]:data-[side=right]:-translate-x-2 data-[state=closed]:data-[side=top]:translate-y-2',
            'data-[state=closed]:scale-95 data-[state=closed]:opacity-0',
            'data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:scale-100',
            className
          )}
          data-state={status === 'open' ? 'open' : 'closed'}
          data-side={context.placement.split('-')[0]}
          style={{
            position: context.strategy,
            top: context.y ?? 0,
            left: context.x ?? 0,
            ...style
          }}
          {...getFloatingProps(props)}
        >
          {children}
        </div>
      </FloatingPortal>
    );
  }
);

const TooltipArrow = forwardRef<SVGSVGElement, Omit<FloatingArrowProps, 'context'>>(
  function TooltipArrow({ className, ...props }, forwardedRef) {
    const { context, arrowRef } = useTooltipContext();
    const ref = useMergeRefs([arrowRef, forwardedRef]);

    return (
      <FloatingArrow
        ref={ref}
        context={context}
        className={cn('fill-foreground', className)}
        tipRadius={2}
        height={ARROW_HEIGHT}
        width={ARROW_WIDTH}
        {...props}
      />
    );
  }
);

interface TooltipGroupProps {
  children: React.ReactNode;
  delayIn?: number;
  delayOut?: number;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 150;

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
const TooltipGroup: FC<TooltipGroupProps> = ({
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  children
}) => {
  return (
    <FloatingDelayGroup delay={{ open: delayIn, close: delayOut }} timeoutMs={timeoutMs}>
      {children}
    </FloatingDelayGroup>
  );
};

/**
 * This is the most flexible (and verbose) way to use the tooltip.
 *
 * It's recommended to use the `Tooltip` component for most use cases.
 *
 * @example
 * ```
 * <TooltipPrimitive.Root>
 *   <TooltipPrimitive.Trigger>Hover me</TooltipPrimitive.Trigger>
 *   <TooltipPrimitive.Content>
 *     <TooltipPrimitive.Arrow />
 *     Hello world
 *   </TooltipPrimitive.Content>
 * </TooltipPrimitive.Root>
 * ```
 */
const TooltipPrimitive = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow
};

export { useTooltipContext, Tooltip, TooltipGroup, TooltipPrimitive };
