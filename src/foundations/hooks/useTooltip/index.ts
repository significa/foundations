import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
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
  useRole
} from '@floating-ui/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { ARROW_HEIGHT, DEFAULT_DELAY_IN, DEFAULT_DELAY_OUT } from './constants';

export interface UseTooltipProps {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: UseFloatingOptions['onOpenChange'];
  placement?: Placement;
  offset?: number;
  delayIn?: number;
  delayOut?: number;
  disabled?: boolean;
  persistOnClick?: boolean;
}

interface UseTooltipOptions extends UseTooltipProps {
  withArrow?: boolean;
}

export const useTooltip = ({
  initialOpen = false,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  placement = 'top',
  offset = 4,
  delayIn = DEFAULT_DELAY_IN,
  delayOut = DEFAULT_DELAY_OUT,
  disabled,
  persistOnClick,
  withArrow = true
}: UseTooltipOptions) => {
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(initialOpen ?? false);

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
    whileElementsMounted: autoUpdate,
    middleware: [
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 8
      }),
      offsetMiddleware(offset + (withArrow ? ARROW_HEIGHT : 0)),
      arrowMiddleware({
        element: withArrow ? arrowRef : null,
        padding: 4
      })
    ]
  });

  const context = floating.context;
  const { delay: groupDelay } = useDelayGroup(context);

  const hover = useHover(context, {
    enabled: !disabled,
    move: false,
    delay: {
      open: typeof groupDelay === 'object' ? groupDelay.open : delayIn,
      close: typeof groupDelay === 'object' ? groupDelay.close : delayOut
    },
    handleClose: safePolygon({})
  });

  const focus = useFocus(context, {
    enabled: !disabled
  });
  const dismiss = useDismiss(context, {
    referencePress: !persistOnClick
  });
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      arrowRef: withArrow ? arrowRef : null,
      ...interactions,
      ...floating
    }),
    [open, setOpen, interactions, floating, withArrow]
  );
};
