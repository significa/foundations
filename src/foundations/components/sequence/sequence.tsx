"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithRef,
  createContext,
  KeyboardEvent,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  InstanceCounterProvider,
  useInstanceCounter,
} from "@/foundations/components/instance-counter/instance-counter";
import { useIntersectionObserver } from "@/foundations/hooks/use-intersection-observer/use-intersection-observer";
import { useTicker } from "@/foundations/hooks/use-ticker/use-ticker";
import { clamp } from "@/foundations/utils/math/clamp";

// @types
type ItemState = "upcoming" | "current" | "past";

// @context
interface SequenceContext {
  id: string;
  orientation: "horizontal" | "vertical";
  set: (index: number) => void;
  next: () => void;
  previous: () => void;
  getItemState: (index: number) => ItemState;
  getItemId: (index: number, role: "tab" | "tabpanel") => string;
  setIsIntersecting: (isIntersecting: boolean) => void;
}

const SequenceContext = createContext<SequenceContext | null>(null);

const useSequenceContext = () => {
  const context = use(SequenceContext);
  if (!context)
    throw new Error("Sequence components must be used within a Sequence");

  return context;
};

// @root
interface SequenceProps extends Omit<ComponentPropsWithRef<"div">, "onChange"> {
  currentIndex?: number;
  asChild?: boolean;
  loop?: boolean;
  duration?: number | number[];
  orientation?: "horizontal" | "vertical";
  paused?: boolean;
  onChange?: (index: number) => void;
}

const Sequence = ({
  children,
  asChild,
  onChange,
  loop,
  orientation = "horizontal",
  paused = false,
  currentIndex: currentIndexProp,
  duration,
  ...rest
}: SequenceProps) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [numItems, setNumItems] = useState(0);

  const durations = useMemo(() => {
    return Array.isArray(duration)
      ? duration
      : new Array(numItems).fill(duration);
  }, [duration, numItems]);

  const progress = useRef(0);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const getItemId = useCallback(
    (index: number, role: "tab" | "tabpanel") => [id, role, index].join("-"),
    [id]
  );

  const getItemState = useCallback(
    (index: number): ItemState => {
      if (index === currentIndex) return "current";
      if (index > currentIndex || index < 0) return "upcoming";
      return "past";
    },
    [currentIndex]
  );

  const handleSetCurrentIndex = useCallback(
    (index: number, preventOnChange: boolean = false) => {
      setCurrentIndex(index);

      if (!preventOnChange) {
        onChange?.(index);
      }

      progress.current = 0;
      if (paused) {
        ref.current?.style.setProperty("--progress", "0");
      }

      if (isIntersecting && ref.current?.contains(document.activeElement)) {
        const id = getItemId(index, "tab");
        document.getElementById(id)?.focus();
      }
    },
    [onChange, getItemId, isIntersecting, paused]
  );

  const next = useCallback(() => {
    handleSetCurrentIndex((currentIndex + 1) % numItems);
  }, [numItems, currentIndex, handleSetCurrentIndex]);

  const previous = useCallback(() => {
    handleSetCurrentIndex(currentIndex > 0 ? currentIndex - 1 : numItems - 1);
  }, [numItems, currentIndex, handleSetCurrentIndex]);

  const ticker = useTicker((_, delta) => {
    if (!numItems) {
      ref.current?.style.setProperty("--progress", "0");
      return true;
    }

    const duration = durations[currentIndex] || 0;
    progress.current = clamp(0, progress.current + delta / duration, 1);
    ref.current?.style.setProperty("--progress", progress.current.toString());

    if (progress.current === 1 && (loop || currentIndex < numItems - 1)) {
      next();
    }

    return progress.current < 1;
  });

  // handle pause/play
  useEffect(() => {
    if (isIntersecting && ticker.paused && !paused) {
      ticker.start();
    }

    if ((!isIntersecting || paused) && !ticker.paused) {
      ticker.stop();
    }
  }, [isIntersecting, ticker, currentIndex, paused]);

  // handle external control
  useEffect(() => {
    if (currentIndexProp !== undefined && currentIndexProp !== currentIndex) {
      handleSetCurrentIndex(currentIndexProp, true);
    }
  }, [handleSetCurrentIndex, currentIndexProp, currentIndex]);

  const Comp = asChild ? Slot : "div";
  return (
    <SequenceContext.Provider
      value={{
        id,
        orientation,
        set: handleSetCurrentIndex,
        getItemState,
        getItemId,
        next,
        previous,
        setIsIntersecting,
      }}
    >
      <InstanceCounterProvider onChange={setNumItems}>
        <Comp
          {...rest}
          ref={ref}
          style={{ "--progress": 0, "--index": currentIndex, ...rest.style }}
        >
          {children}
        </Comp>
      </InstanceCounterProvider>
    </SequenceContext.Provider>
  );
};

// @items
interface SequenceItemsProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const SequenceItems = ({ children, asChild, ...rest }: SequenceItemsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { orientation, setIsIntersecting } = useSequenceContext();

  useIntersectionObserver(ref, {}, setIsIntersecting);

  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...rest}
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      aria-live="polite"
    >
      {children}
    </Comp>
  );
};

// @item
interface SequenceItemProps extends ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const SequenceItem = ({
  children,
  asChild,
  onClick,
  onKeyDown,
  ...rest
}: SequenceItemProps) => {
  const { orientation, set, next, previous, getItemState, getItemId } =
    useSequenceContext();

  const index = useInstanceCounter();
  const state = getItemState(index);

  const handleKeyboardNavigation = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      set(index);
    }

    const keyOrientationMap = {
      horizontal: { next: "ArrowRight", prev: "ArrowLeft" },
      vertical: { next: "ArrowDown", prev: "ArrowUp" },
    };

    if (keyOrientationMap[orientation].next === e.key) {
      e.preventDefault();
      next();
    }

    if (keyOrientationMap[orientation].prev === e.key) {
      e.preventDefault();
      previous();
    }
  };

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...rest}
      id={getItemId(index, "tab")}
      role="tab"
      aria-selected={state === "current"}
      aria-controls={getItemId(index, "tabpanel")}
      data-state={state}
      data-selected={state === "current"}
      tabIndex={state === "current" ? 0 : -1}
      style={{
        ...(state !== "current" && { "--progress": +(state === "past") }),
        ...rest.style,
      }}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) set(index);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) handleKeyboardNavigation(e);
      }}
    >
      {children}
    </Comp>
  );
};

// @panels
interface SequencePanelsProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const SequencePanels = ({
  children,
  asChild,
  ...rest
}: SequencePanelsProps) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp {...rest}>
      <InstanceCounterProvider>{children}</InstanceCounterProvider>
    </Comp>
  );
};

// @panel
interface SequencePanelProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
  forceMount?: boolean;
}

const SequencePanel = ({
  children,
  asChild,
  forceMount,
  ...rest
}: SequencePanelProps) => {
  const { getItemState, getItemId } = useSequenceContext();

  const index = useInstanceCounter();
  const state = getItemState(index);

  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...rest}
      id={getItemId(index, "tabpanel")}
      data-state={state}
      data-selected={state === "current"}
      role="tabpanel"
      aria-labelledby={getItemId(index, "tab")}
      aria-hidden={state !== "current"}
      inert={state !== "current"}
      style={{
        ...(state !== "current" && { "--progress": +(state === "past") }),
        ...rest.style,
      }}
    >
      {forceMount || state === "current" ? children : null}
    </Comp>
  );
};

export { Sequence, SequenceItem, SequencePanels, SequencePanel, SequenceItems };
