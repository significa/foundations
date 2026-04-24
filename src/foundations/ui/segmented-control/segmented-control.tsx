import { motion } from 'motion/react';
import {
  createContext,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { Slot } from '@/foundations/components/slot/slot';
import { cn } from '@/lib/utils/classnames';

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
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  children: React.ReactNode;
}

const SegmentedControl = ({
  defaultIndex,
  selectedIndex: selectedIndexProp,
  onChange: onChangeProp,
  children,
  ...props
}: SegmentedControlProps) => {
  const id = useId();
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(
    defaultIndex ?? 0
  );
  const [segments, setSegments] = useState<string[]>([]);

  const selectedIndex = selectedIndexProp ?? internalSelectedIndex;

  const setSelectedIndex = useCallback(
    (index: number) => {
      setInternalSelectedIndex(index);
      onChangeProp?.(index);

      // focus on the selected segment when changing index
      const itemId = getItemId(segments[index]);
      if (itemId) {
        const selectedSegment = document.getElementById(itemId);
        selectedSegment?.focus();
      }
    },
    [onChangeProp, segments]
  );

  const next = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % segments.length);
  }, [segments.length, selectedIndex, setSelectedIndex]);

  const previous = useCallback(() => {
    setSelectedIndex(
      selectedIndex <= 0 ? segments.length - 1 : selectedIndex - 1
    );
  }, [segments.length, selectedIndex, setSelectedIndex]);

  const registerSegment = useCallback((id: string) => {
    setSegments((prev) => [...prev, id]);

    return () => {
      setSegments((prev) => prev.filter((prevId) => prevId !== id));
    };
  }, []);

  const selectedSegment = useMemo(
    () => segments[selectedIndex],
    [segments, selectedIndex]
  );

  const setSelectedSegment = useCallback(
    (id: string) => {
      setSelectedIndex(segments.indexOf(id));
    },
    [segments, setSelectedIndex]
  );

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
      <div {...props}>{children}</div>
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
}

const getItemId = (id: string | undefined) => (id ? `segment-${id}` : undefined);

const SegmentedControlItem = ({
  children,
  asChild,
  onClick,
  onKeyDown,
  className,
  ...props
}: SegmentedControlItemProps) => {
  const id = useId();
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
    registerSegment(id);
  }, [id, registerSegment]);

  const isSelected = selectedSegment === id;

  const handleKeyboardNavigation = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const keyOrientationMap = {
      next: 'ArrowRight',
      prev: 'ArrowLeft',
    };

    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedSegment(id);
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
      id={getItemId(id)}
      type="button"
      className={cn(
        'relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-foreground/50 outline-none ring-ring transition hover:text-foreground focus-visible:ring-4 data-selected:text-foreground',
        '[&>*:not([data-segment-indicator])]:z-10',
        className
      )}
      role="tab"
      aria-selected={isSelected || undefined}
      data-selected={isSelected || undefined}
      tabIndex={isSelected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) {
          setSelectedSegment(id);
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
      {typeof children === 'string' ? <span>{children}</span> : children}
      {isSelected && (
        <motion.span
          data-segment-indicator="true"
          layoutId={segmentsId}
          aria-hidden="true"
          className="absolute inset-0 z-0 rounded-xl bg-background-secondary"
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
