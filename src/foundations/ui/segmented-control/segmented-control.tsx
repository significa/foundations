import { motion } from 'motion/react';
import {
  Children,
  createContext,
  isValidElement,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { Slot } from '@/foundations/components/slot/slot';
import { cn } from '@/lib/utils/classnames';

let segmentedControlInstanceCounter = 0;

interface SegmentedControlContextValue {
  id: string;
  segments: string[];
  selectedSegment: string | undefined;
  setSelectedSegment: (id: string) => void;
  next: () => void;
  previous: () => void;
  registerSegment: (id: string) => () => void;
}

const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null);

const useSegmentedControlContext = () => {
  const context = use(SegmentedControlContext);
  if (!context)
    throw new Error(
      'SegmentedControlContext must be used within a SegmentedControl component'
    );
  return context;
};

interface SegmentedControlProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'onChange'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

const SegmentedControl = ({
  defaultValue,
  value: selectedValueProp,
  onChange: onChangeProp,
  className,
  children,
  ...props
}: SegmentedControlProps) => {
  const reactId = useId();
  const [id] = useState(
    () => `${reactId}-${++segmentedControlInstanceCounter}`
  );
  const [internalSelectedValue, setInternalSelectedValue] = useState<
    string | undefined
  >(defaultValue);
  const [segments, setSegments] = useState<string[]>([]);

  const explicitSelected = selectedValueProp ?? internalSelectedValue;

  // Items register via useLayoutEffect, so on SSR / first paint `segments` is
  // empty. Walk children directly to derive the default selection — otherwise
  // every item gets `tabIndex=-1` until hydration, breaking keyboard entry.
  const selectedSegment = useMemo(() => {
    if (explicitSelected !== undefined) return explicitSelected;
    if (segments.length > 0) return segments[0];
    let first: string | undefined;
    Children.forEach(children, (child) => {
      if (first !== undefined) return;
      if (
        isValidElement<{ value?: unknown }>(child) &&
        typeof child.props.value === 'string'
      ) {
        first = child.props.value;
      }
    });
    return first;
  }, [explicitSelected, segments, children]);

  useLayoutEffect(() => {
    if (explicitSelected === undefined && segments.length > 0) {
      setInternalSelectedValue(segments[0]);
    }
  }, [segments, explicitSelected]);

  const setSelectedSegment = useCallback(
    (value: string) => {
      setInternalSelectedValue(value);
      onChangeProp?.(value);

      const itemId = getItemId(value);
      if (itemId) {
        document.getElementById(itemId)?.focus();
      }
    },
    [onChangeProp]
  );

  const next = useCallback(() => {
    const index = segments.indexOf(selectedSegment ?? '');
    const nextSegment = segments[(index + 1) % segments.length];
    if (nextSegment) setSelectedSegment(nextSegment);
  }, [segments, selectedSegment, setSelectedSegment]);

  const previous = useCallback(() => {
    const index = segments.indexOf(selectedSegment ?? '');
    const prevSegment = segments[index <= 0 ? segments.length - 1 : index - 1];
    if (prevSegment) setSelectedSegment(prevSegment);
  }, [segments, selectedSegment, setSelectedSegment]);

  const registerSegment = useCallback((id: string) => {
    setSegments((prev) => [...prev, id]);

    return () => {
      setSegments((prev) => prev.filter((prevId) => prevId !== id));
    };
  }, []);

  const ctx = useMemo(
    () => ({
      id,
      segments,
      selectedSegment,
      setSelectedSegment,
      next,
      previous,
      registerSegment,
    }),
    [
      id,
      segments,
      selectedSegment,
      setSelectedSegment,
      next,
      previous,
      registerSegment,
    ]
  );

  return (
    <SegmentedControlContext value={ctx}>
      <div
        role="radiogroup"
        className={cn(
          'flex rounded-2xl bg-background-secondary p-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SegmentedControlContext>
  );
};

interface SegmentedControlItemProps
  extends Omit<
    React.ComponentPropsWithRef<'button'>,
    'id' | 'type' | 'disabled'
  > {
  children: React.ReactNode;
  asChild?: boolean;
  value: string;
}

const getItemId = (id: string | undefined) =>
  id ? `segment-${id}` : undefined;

const SegmentedControlItem = ({
  children,
  asChild,
  onClick,
  onKeyDown,
  className,
  value,
  ...props
}: SegmentedControlItemProps) => {
  const {
    id: segmentsId,
    selectedSegment,
    setSelectedSegment,
    registerSegment,
    next,
    previous,
  } = useSegmentedControlContext();

  const Comp = asChild ? Slot : 'button';

  useLayoutEffect(() => {
    return registerSegment(value);
  }, [value, registerSegment]);

  const isSelected = selectedSegment === value;

  const handleKeyboardNavigation = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const keyOrientationMap = {
      next: 'ArrowRight',
      prev: 'ArrowLeft',
    };

    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedSegment(value);
    }

    if (keyOrientationMap.next === e.key) {
      e.preventDefault();
      next();
    }

    if (keyOrientationMap.prev === e.key) {
      e.preventDefault();
      previous();
    }
  };

  return (
    <Comp
      id={getItemId(value)}
      type="button"
      className={cn(
        'relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-foreground/50 outline-none ring-ring transition hover:text-foreground focus-visible:ring-4 data-selected:text-foreground',
        '[&>*:not([data-segment-indicator])]:z-10',
        className
      )}
      role="radio"
      aria-checked={isSelected}
      data-selected={isSelected || undefined}
      tabIndex={isSelected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) {
          setSelectedSegment(value);
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);

        if (!e.defaultPrevented) {
          handleKeyboardNavigation(e);
        }
      }}
      value={value}
      {...props}
    >
      {typeof children === 'string' ? <span>{children}</span> : children}
      {isSelected && (
        <motion.span
          data-segment-indicator="true"
          layoutId={segmentsId}
          aria-hidden="true"
          className="absolute inset-0 z-0 rounded-xl bg-background"
          transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
        />
      )}
    </Comp>
  );
};

const CompoundSegmentedControl = Object.assign(SegmentedControl, {
  Item: SegmentedControlItem,
});

export { CompoundSegmentedControl as SegmentedControl };
