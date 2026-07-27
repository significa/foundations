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
  useRef,
} from "react";
import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { clamp } from "@/foundations/utils/math/clamp";
import { cn } from "@/lib/utils/classnames";

// The number of pixels to move when using the keyboard to resize.
const KEYBOARD_ARROW_PX_STEP = 10;

const findAdjacentPanel = (from: Element, direction: "next" | "previous") => {
  let element = (
    direction === "next" ? from.nextElementSibling : from.previousElementSibling
  ) as HTMLElement | null;
  while (element && !element.hasAttribute("data-ui-resizable-panel")) {
    element = (
      direction === "next" ? element.nextElementSibling : element.previousElementSibling
    ) as HTMLElement | null;
  }
  return element;
};

type Orientation = "horizontal" | "vertical";

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

type ResizableProps = Omit<React.ComponentPropsWithRef<"div">, "onResize"> & {
  orientation?: Orientation;
  persist: string;
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

  const persistKey = persistId ? `foundations-resizable:${persistId}` : null;

  const registerPanel = useCallback((element: HTMLElement, panel: RegisteredPanel) => {
    panels.current.set(element, panel);
    return () => panels.current.delete(element);
  }, []);

  // Persist panel sizes to localStorage
  const persist = useCallback(() => {
    const root = scope.current;
    if (!persistKey || !root) return;

    const side = orientation === "horizontal" ? "width" : "height";

    const sizes: Record<string, string> = {};
    for (const [element, { id }] of panels.current.entries()) {
      sizes[id] = element.style[side];
    }

    try {
      localStorage.setItem(persistKey, JSON.stringify(sizes));
    } catch {} // ignore localStorage errors
  }, [persistKey, orientation]);

  const createResizeHandler = useCallback(
    (panelBefore: HTMLElement, panelAfter: HTMLElement) => {
      const root = scope.current;
      if (!root || !panelBefore || !panelAfter) {
        return {
          move: () => undefined,
          set: () => undefined,
          commit: () => undefined,
        };
      }

      const side = orientation === "horizontal" ? "width" : "height";

      // sizes when resize started
      const rootCurrent = root.getBoundingClientRect()[side];
      const panelBeforeCurrent = panelBefore.getBoundingClientRect()[side];
      const panelAfterCurrent = panelAfter.getBoundingClientRect()[side];

      // calculate the min/max range for each panel based on its CSS properties
      const calcPanelRange = (panel: HTMLElement, oppositePanel: HTMLElement) => {
        const previousStyles = {
          panel: panel.style[side],
          oppositePanel: oppositePanel.style[side],
        };

        panel.style[side] = "0rem";
        oppositePanel.style[side] = "999rem";
        const min = panel.getBoundingClientRect()[side];
        panel.style[side] = "999rem";
        oppositePanel.style[side] = "0rem";
        const max = panel.getBoundingClientRect()[side];

        panel.style[side] = previousStyles.panel;
        oppositePanel.style[side] = previousStyles.oppositePanel;

        return { min, max };
      };

      // size range for each panel
      const panelBeforeRange = calcPanelRange(panelBefore, panelAfter);
      const panelAfterRange = calcPanelRange(panelAfter, panelBefore);

      // methods
      const panelBeforeSnap = panels.current.get(panelBefore)?.snap;
      const panelAfterSnap = panels.current.get(panelAfter)?.snap;
      const panelBeforeOnResize = panels.current.get(panelBefore)?.onResize;
      const panelAfterOnResize = panels.current.get(panelAfter)?.onResize;

      // store how much we've moved so far (in px)
      // so we can easily calculate the new size from the current size
      // and thereby avoid size look-ups during apply (i.e. during drag)
      let cumulativeDelta = 0;

      // the space the two panels share stays constant during a drag
      const combined = panelBeforeCurrent + panelAfterCurrent;

      // write the pair as percentages of the root; they always sum to `combined`
      const write = (sizeBefore: number) => {
        panelBefore.style[side] = `${(sizeBefore / rootCurrent) * 100}%`;
        panelAfter.style[side] = `${((combined - sizeBefore) / rootCurrent) * 100}%`;
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
        if (panelBeforeSnap) sizeBefore = panelBeforeSnap(panelBeforeNew);
        else if (panelAfterSnap) sizeBefore = combined - panelAfterSnap(panelAfterNew);

        write(sizeBefore);

        // read-only notifications get the raw pointer-tracked size (pre-snap)
        panelBeforeOnResize?.(panelBeforeNew);
        panelAfterOnResize?.(panelAfterNew);
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

    const side = orientation === "horizontal" ? "width" : "height";

    let persistedSizes: Record<string, string> = {};
    if (persistKey) {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) persistedSizes = JSON.parse(stored);
      } catch {} // ignore malformed storage values
    }

    const rootSize = root.getBoundingClientRect()[side];
    for (const panel of root.querySelectorAll<HTMLElement>("& > [data-ui-resizable-panel]")) {
      const panelId = panel.getAttribute("data-ui-resizable-panel") || "unknown";
      const size = panel.getBoundingClientRect()[side];
      const persistedSize = persistedSizes[panelId];

      // defer applying the size so subsequent panel size look-ups are accurate to the initial sizes
      window.requestAnimationFrame(() => {
        panel.style[side] = persistedSize ? persistedSize : `${(size / rootSize) * 100}%`;
      });
    }
  }, [orientation, persistKey]);

  return (
    <ResizableContext value={{ orientation, registerPanel, createResizeHandler }}>
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

type ResizablePanelRef = {
  /** Set the panel's size in pixels. The adjacent panel absorbs the difference. */
  resize: (size: number) => void;
};

type ResizablePanelProps = Omit<React.ComponentPropsWithRef<"div">, "ref"> & {
  /** Imperative handle to set this panel's size programmatically. */
  ref?: React.Ref<ResizablePanelRef>;
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

    return registerPanel(element, {
      id,
      snap,
      onResize,
    });
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

    const clientOffset = orientation === "horizontal" ? "clientX" : "clientY";
    const startOffset = event[clientOffset];

    const handler = createResizeHandler(panelBefore, panelAfter);

    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = orientation === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    let previousDelta = 0;
    const onDrag = ({ [clientOffset]: offset }: PointerEvent) => {
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

    const back = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

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
  type ResizablePanelProps,
  type ResizableProps,
};
