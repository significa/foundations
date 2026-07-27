import {
  createContext,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
  use,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { clamp } from "@/foundations/utils/math/clamp";
import { cn } from "@/lib/utils/classnames";

// Constants

// The number of pixels to move when using the keyboard to resize.
const KEYBOARD_ARROW_PX_STEP = 10;

// Attribute a panel tags itself with, so handles can find their neighbours by
// DOM traversal and the root can restore sizes on mount.
const PANEL_ATTR = "data-ui-resizable-panel";

// localStorage key prefix for persisted panel sizes.
const STORAGE_PREFIX = "foundations-resizable:";

type Orientation = "horizontal" | "vertical";

// Everything that depends on the axis in one table, so component code reads a
// value instead of re-deriving it from an `orientation === "horizontal"` ternary.
const AXIS = {
  horizontal: {
    size: "width",
    clientAxis: "clientX",
    cursor: "col-resize",
    back: "ArrowLeft",
    forward: "ArrowRight",
  },
  vertical: {
    size: "height",
    clientAxis: "clientY",
    cursor: "row-resize",
    back: "ArrowUp",
    forward: "ArrowDown",
  },
} as const;

// Utils

const noop = () => undefined;

const findAdjacentPanel = (from: Element, direction: "next" | "previous") => {
  const step = (el: Element) =>
    direction === "next" ? el.nextElementSibling : el.previousElementSibling;

  let element = step(from) as HTMLElement | null;
  while (element && !element.hasAttribute(PANEL_ATTR)) {
    element = step(element) as HTMLElement | null;
  }
  return element;
};

// Measure a panel's min/max size in px by momentarily forcing it (and its
// neighbor) to the extremes, letting CSS min/max constraints clamp the result.
const measureRange = (panel: HTMLElement, opposite: HTMLElement, size: "width" | "height") => {
  const previous = { panel: panel.style[size], opposite: opposite.style[size] };

  panel.style[size] = "0rem";
  opposite.style[size] = "999rem";
  const min = panel.getBoundingClientRect()[size];

  panel.style[size] = "999rem";
  opposite.style[size] = "0rem";
  const max = panel.getBoundingClientRect()[size];

  panel.style[size] = previous.panel;
  opposite.style[size] = previous.opposite;

  return { min, max };
};

// Context

type RegisteredPanel = {
  id: string;
  onResize?: (size: number) => void;
  snap?: (size: number) => number;
};

type ResizeHandler = {
  move: (delta: number) => void;
  set: (size: number) => void;
  commit: () => void;
};

type ResizableContextValue = {
  orientation: Orientation;
  registerPanel: (element: HTMLElement, panel: RegisteredPanel) => () => void;
  createResizeHandler: (beforePanel: HTMLElement, afterPanel: HTMLElement) => ResizeHandler;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

const useResizableContext = () => {
  const context = use(ResizableContext);
  if (!context) throw new Error("Resizable components must be used within a Resizable");
  return context;
};

// Components

type ResizableProps = Omit<React.ComponentPropsWithRef<"div">, "onResize"> & {
  orientation?: Orientation;
  /**
   * Unique key used to save panel sizes to localStorage and restore them on the
   * next visit. Omit to disable persistence.
   */
  persist?: string;
  children: React.ReactNode;
};

const Resizable = ({
  orientation = "horizontal",
  persist: persistId,
  className,
  children,
  ref,
  ...props
}: ResizableProps) => {
  const scope = useRef<HTMLDivElement>(null);
  const panels = useRef<Map<HTMLElement, RegisteredPanel>>(new Map());

  const persistKey = persistId ? `${STORAGE_PREFIX}${persistId}` : null;

  const registerPanel = useCallback((element: HTMLElement, panel: RegisteredPanel) => {
    panels.current.set(element, panel);
    return () => panels.current.delete(element);
  }, []);

  // Persist panel sizes to localStorage
  const persist = useCallback(() => {
    const root = scope.current;
    if (!persistKey || !root) return;

    const { size } = AXIS[orientation];

    const sizes: Record<string, string> = {};
    for (const [element, { id }] of panels.current.entries()) {
      sizes[id] = element.style[size];
    }

    try {
      localStorage.setItem(persistKey, JSON.stringify(sizes));
    } catch {} // ignore localStorage errors
  }, [persistKey, orientation]);

  const createResizeHandler = useCallback(
    (panelBefore: HTMLElement, panelAfter: HTMLElement): ResizeHandler => {
      const root = scope.current;
      if (!root || !panelBefore || !panelAfter) {
        return { move: noop, set: noop, commit: noop };
      }

      const { size } = AXIS[orientation];

      // sizes when resize started
      const rootCurrent = root.getBoundingClientRect()[size];
      const panelBeforeCurrent = panelBefore.getBoundingClientRect()[size];
      const panelAfterCurrent = panelAfter.getBoundingClientRect()[size];

      // size range for each panel, derived from its CSS min/max constraints
      const panelBeforeRange = measureRange(panelBefore, panelAfter, size);
      const panelAfterRange = measureRange(panelAfter, panelBefore, size);

      // per-panel transformers/notifications registered on the panels
      const before = panels.current.get(panelBefore);
      const after = panels.current.get(panelAfter);

      // store how much we've moved so far (in px)
      // so we can easily calculate the new size from the current size
      // and thereby avoid size look-ups during apply (i.e. during drag)
      let cumulativeDelta = 0;

      // the space the two panels share stays constant during a drag
      const combined = panelBeforeCurrent + panelAfterCurrent;

      // write the pair as percentages of the root; they always sum to `combined`
      const write = (sizeBefore: number) => {
        panelBefore.style[size] = `${(sizeBefore / rootCurrent) * 100}%`;
        panelAfter.style[size] = `${((combined - sizeBefore) / rootCurrent) * 100}%`;
      };

      const move = (pxDelta: number) => {
        const panelBeforeNew = panelBeforeCurrent + cumulativeDelta + pxDelta;
        const panelAfterNew = panelAfterCurrent - (cumulativeDelta + pxDelta);

        // check if new size is within range
        if (panelBeforeNew < panelBeforeRange.min) return;
        if (panelAfterNew < panelAfterRange.min) return;
        if (panelBeforeNew > panelBeforeRange.max) return;
        if (panelAfterNew > panelAfterRange.max) return;

        // only update cumulativeDelta if new size is within range
        cumulativeDelta += pxDelta;

        // a snap transformer returns the size its panel should take; the other
        // panel absorbs the difference (write derives it from `combined`)
        let sizeBefore = panelBeforeNew;
        if (before?.snap) sizeBefore = before.snap(panelBeforeNew);
        else if (after?.snap) sizeBefore = combined - after.snap(panelAfterNew);

        write(sizeBefore);

        // read-only notifications get the raw pointer-tracked size (pre-snap)
        before?.onResize?.(panelBeforeNew);
        after?.onResize?.(panelAfterNew);
      };

      // set the leading panel to an absolute size, clamped to its range; no snap
      // or onResize (this is an imperative resize, not a drag)
      const set = (size: number) => {
        write(clamp(panelBeforeRange.min, size, panelBeforeRange.max));
      };

      return { move, set, commit: persist };
    },
    [orientation, persist],
  );

  // Normalize panel sizes on mount or restore persisted sizes from localStorage
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const { size } = AXIS[orientation];

    let persistedSizes: Record<string, string> = {};
    if (persistKey) {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) persistedSizes = JSON.parse(stored);
      } catch {} // ignore malformed storage values
    }

    const rootSize = root.getBoundingClientRect()[size];
    for (const panel of root.querySelectorAll<HTMLElement>(`& > [${PANEL_ATTR}]`)) {
      const panelId = panel.getAttribute(PANEL_ATTR) || "unknown";
      const panelSize = panel.getBoundingClientRect()[size];
      const persistedSize = persistedSizes[panelId];

      // defer applying the size so subsequent panel size look-ups are accurate to the initial sizes
      window.requestAnimationFrame(() => {
        panel.style[size] = persistedSize ? persistedSize : `${(panelSize / rootSize) * 100}%`;
      });
    }
  }, [orientation, persistKey]);

  const context = useMemo<ResizableContextValue>(
    () => ({ orientation, registerPanel, createResizeHandler }),
    [orientation, registerPanel, createResizeHandler],
  );

  return (
    <ResizableContext value={context}>
      <div
        ref={composeRefs(ref, scope)}
        className={cn(
          "flex min-h-0 min-w-0 overflow-hidden",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ResizableContext>
  );
};

type ResizablePanelHandle = {
  /** Set the panel's size in pixels. The adjacent panel absorbs the difference. */
  resize: (size: number) => void;
};

type ResizablePanelProps = Omit<React.ComponentPropsWithRef<"div">, "ref"> & {
  /** Imperative handle to set this panel's size programmatically. */
  ref?: React.Ref<ResizablePanelHandle>;
  asChild?: boolean;
  /**
   * Transform the panel's size during a resize: receives the pointer-tracked
   * size in px and returns the size the panel should take. Runs every frame, so
   * it can snap or collapse the panel. Return the size unchanged for a no-op.
   */
  snap?: (size: number) => number;
  /** Read-only notification fired during drag/keyboard resize with the size in px. */
  onResize?: (size: number) => void;
};

const ResizablePanel = ({
  asChild,
  ref: propRef,
  snap,
  onResize,
  className,
  children,
  ...props
}: ResizablePanelProps) => {
  const { registerPanel, createResizeHandler } = useResizableContext();
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Expose imperative handle
  useImperativeHandle(propRef, () => ({
    resize: (size) => {
      const element = ref.current;
      if (!element) return;

      const oppositePanel =
        findAdjacentPanel(element, "next") ?? findAdjacentPanel(element, "previous");
      if (!oppositePanel) return;

      const handler = createResizeHandler(element, oppositePanel);
      handler.set(size);
      handler.commit();
    },
  }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return registerPanel(element, { id, snap, onResize });
  }, [registerPanel, id, snap, onResize]);

  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      data-ui-resizable-panel={id}
      className={cn("min-h-0 w-full min-w-0 grow overflow-auto", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

type ResizableHandleProps = Omit<React.ComponentPropsWithRef<"div">, "children">;

const ResizableHandle = ({
  className,
  ref: propRef,
  onPointerDown,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: ResizableHandleProps) => {
  const { orientation, createResizeHandler } = useResizableContext();
  const ref = useRef<HTMLDivElement>(null);
  const keyHandlerRef = useRef<ResizeHandler | null>(null);

  const getAdjacentPanels = () => {
    const element = ref.current;
    if (!element) return { panelBefore: null, panelAfter: null };
    return {
      panelBefore: findAdjacentPanel(element, "previous"),
      panelAfter: findAdjacentPanel(element, "next"),
    };
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    onPointerDown?.(event);
    if (event.defaultPrevented) return;

    const { panelBefore, panelAfter } = getAdjacentPanels();
    if (!panelBefore || !panelAfter) return;

    const { clientAxis, cursor } = AXIS[orientation];
    const startOffset = event[clientAxis];

    const handler = createResizeHandler(panelBefore, panelAfter);

    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";

    let previousDelta = 0;
    const onDrag = ({ [clientAxis]: offset }: PointerEvent) => {
      const currentDelta = offset - startOffset - previousDelta;
      previousDelta = offset - startOffset;
      handler.move(currentDelta);
    };

    const onDragEnd = () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      window.removeEventListener("pointermove", onDrag);

      handler.commit();
    };

    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", onDragEnd, { once: true });
    window.addEventListener("pointercancel", onDragEnd, { once: true });
  };

  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => {
    onFocus?.(e);
    if (e.defaultPrevented) return;

    if (keyHandlerRef.current) return;
    const { panelBefore, panelAfter } = getAdjacentPanels();
    if (!panelBefore || !panelAfter) return;
    keyHandlerRef.current = createResizeHandler(panelBefore, panelAfter);
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    onBlur?.(e);
    if (e.defaultPrevented) return;

    keyHandlerRef.current?.commit();
    keyHandlerRef.current = null;
  };

  const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const handler = keyHandlerRef.current;
    if (!handler) return;

    const { back, forward } = AXIS[orientation];

    if (event.key === forward) {
      event.preventDefault();
      return handler.move(KEYBOARD_ARROW_PX_STEP);
    }

    if (event.key === back) {
      event.preventDefault();
      return handler.move(-KEYBOARD_ARROW_PX_STEP);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: hr element does not support after pseudo element
    <div
      // biome-ignore lint/a11y/useAriaPropsForRole: hr element does not support after pseudo element
      role="separator"
      aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
      tabIndex={0}
      ref={composeRefs(ref, propRef)}
      className={cn(
        "relative touch-none border-border outline-none ring-ring",
        "hover:border-foreground/24 hover:border-dashed active:border-foreground/48 active:border-dashed",
        "focus-visible:ring-(length:--ring-width)",
        "after:absolute after:inset-0",
        orientation === "horizontal"
          ? "h-full w-px cursor-col-resize border-l after:-inset-x-2"
          : "h-px w-full cursor-row-resize border-t after:-inset-y-2",
        className,
      )}
      onPointerDown={handlePointerDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeydown}
      {...props}
    />
  );
};

const CompoundResizable = Object.assign(Resizable, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

export {
  CompoundResizable as Resizable,
  type ResizableHandleProps,
  type ResizablePanelHandle,
  type ResizablePanelProps,
  type ResizableProps,
};
