import {
  createContext,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  InstanceCounterProvider,
  useInstanceCounter,
} from "@/foundations/components/instance-counter/instance-counter";
import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils/classnames";

// The number of pixels to move when using the keyboard to resize.
const KEYBOARD_ARROW_PX_STEP = 10;

const getLocalstorageKey = (id: string) => `foundations-ui:resizable-${id}`;

type Orientation = "horizontal" | "vertical";

type ResizeHandler = {
  apply: (pxDelta: number) => void;
};

type PanelOnResizeCallback = (size: number, setSize: (size: number) => void) => void;

type ResizableContextValue = {
  orientation: Orientation;
  scope: React.RefObject<HTMLDivElement | null>;
  registerPanelCallback: (index: number, callback: PanelOnResizeCallback) => () => void;
  createResizeHandler: (panelBefore: HTMLElement, panelAfter: HTMLElement) => ResizeHandler;
  persist: () => void;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

const useResizableContext = () => {
  const context = use(ResizableContext);
  if (!context) throw new Error("Resizable components must be used within a Resizable");
  return context;
};

type ResizableProps = Omit<React.ComponentPropsWithRef<"div">, "onResize"> & {
  orientation?: Orientation;
  persist?: string;
  children: React.ReactNode;
};

const Resizable = ({
  orientation = "horizontal",
  persist: persistKey,
  className,
  children,
  ref,
  ...props
}: ResizableProps) => {
  const scope = useRef<HTMLDivElement>(null);
  const panelCallbacks = useRef<(PanelOnResizeCallback | null)[]>([]);

  const registerPanelCallback = useCallback((index: number, callback: PanelOnResizeCallback) => {
    panelCallbacks.current[index] = callback;
    return () => {
      panelCallbacks.current[index] = null;
    };
  }, []);

  const keys = useMemo(() => {
    return {
      side: orientation === "horizontal" ? "width" : "height",
      sideOffset: orientation === "horizontal" ? "offsetWidth" : "offsetHeight",
      clientOffset: orientation === "horizontal" ? "clientX" : "clientY",
    } as const;
  }, [orientation]);

  const createResizeHandler = useCallback(
    (panelBefore: HTMLElement, panelAfter: HTMLElement) => {
      const root = scope.current;
      if (!root) return { apply: () => undefined };

      const panelBeforeIndex = parseInt(
        panelBefore.getAttribute("data-ui-resizable-panel") ?? "",
        10,
      );
      const panelAfterIndex = parseInt(
        panelAfter.getAttribute("data-ui-resizable-panel") ?? "",
        10,
      );
      const panelBeforeCallback = Number.isNaN(panelBeforeIndex)
        ? null
        : (panelCallbacks.current[panelBeforeIndex] ?? null);
      const panelAfterCallback = Number.isNaN(panelAfterIndex)
        ? null
        : (panelCallbacks.current[panelAfterIndex] ?? null);

      // sizes when drag started
      const rootCurrent = root[keys.sideOffset];
      const panelBeforeCurrent = panelBefore.getBoundingClientRect()[keys.side];
      const panelAfterCurrent = panelAfter.getBoundingClientRect()[keys.side];

      const calcPanelRange = (panel: HTMLElement, oppositePanel: HTMLElement) => {
        const previousStyles = {
          panel: panel.style[keys.side],
          oppositePanel: oppositePanel.style[keys.side],
        };

        panel.style[keys.side] = "0rem";
        oppositePanel.style[keys.side] = "999rem";
        const min = panel.getBoundingClientRect()[keys.side];
        panel.style[keys.side] = "999rem";
        oppositePanel.style[keys.side] = "0rem";
        const max = panel.getBoundingClientRect()[keys.side];

        panel.style[keys.side] = previousStyles.panel;
        oppositePanel.style[keys.side] = previousStyles.oppositePanel;

        return { min, max };
      };

      // size range for each panel
      const panelBeforeRange = calcPanelRange(panelBefore, panelAfter);
      const panelAfterRange = calcPanelRange(panelAfter, panelBefore);

      // store how much we've moved so far (in px)
      // so we can easily calculate the new size from the current size
      // and thereby avoid size look-ups during apply (i.e. during drag)
      let cumulativeDelta = 0;

      const setPanelSize = (panel: HTMLElement, oppositePanel: HTMLElement, size: number) => {
        const otherSize = panelBeforeCurrent + panelAfterCurrent - size;
        panel.style[keys.side] = `${(size / rootCurrent) * 100}%`;
        oppositePanel.style[keys.side] = `${(otherSize / rootCurrent) * 100}%`;
      };

      const apply = (pxDelta: number) => {
        const panelBeforeNew = panelBeforeCurrent + cumulativeDelta + pxDelta;
        const panelAfterNew = panelAfterCurrent - (cumulativeDelta + pxDelta);

        // check if new size is within range
        if (panelBeforeNew < panelBeforeRange.min) return;
        if (panelAfterNew < panelAfterRange.min) return;
        if (panelBeforeNew > panelBeforeRange.max) return;
        if (panelAfterNew > panelAfterRange.max) return;

        // only update cumulativeDelta if new size is within range
        cumulativeDelta += pxDelta;

        panelBefore.style[keys.side] = `${(panelBeforeNew / rootCurrent) * 100}%`;
        panelAfter.style[keys.side] = `${(panelAfterNew / rootCurrent) * 100}%`;

        panelBeforeCallback?.(panelBeforeNew, (newSize) =>
          setPanelSize(panelBefore, panelAfter, newSize),
        );
        panelAfterCallback?.(panelAfterNew, (newSize) =>
          setPanelSize(panelAfter, panelBefore, newSize),
        );
      };

      return { apply };
    },
    [keys],
  );

  const persist = useCallback(() => {
    if (!persistKey || !scope.current) return;
    const sizes: Record<string, string> = {};
    for (const child of scope.current.children) {
      if (!(child instanceof HTMLElement) || !child.hasAttribute("data-ui-resizable-panel"))
        continue;
      const id = child.getAttribute("data-ui-resizable-panel");
      if (id !== null) sizes[id] = child.style[keys.side];
    }
    try {
      localStorage.setItem(getLocalstorageKey(persistKey), JSON.stringify(sizes));
    } catch {
      // ignore localStorage errors
    }
  }, [persistKey, keys.side]);

  // normalize panel sizes on mount
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const panels = Array.from(root.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.hasAttribute("data-ui-resizable-panel"),
    );

    let persistedSizes: Record<string, string> = {};
    try {
      const stored = persistKey && localStorage.getItem(getLocalstorageKey(persistKey));
      if (stored) persistedSizes = JSON.parse(stored);
    } catch {
      // ignore malformed storage values
    }

    const rootSize = root.getBoundingClientRect()[keys.side];
    for (const panel of panels) {
      const panelId = panel.getAttribute("data-ui-resizable-panel") || "0";
      const size = panel.getBoundingClientRect()[keys.side];
      const persistedSize = persistedSizes[panelId];

      // defer applying the size so subsequent panel size look-ups are accurate to the initial sizes
      window.requestAnimationFrame(() => {
        panel.style[keys.side] = persistedSize ? persistedSize : `${(size / rootSize) * 100}%`;
      });
    }
  }, [keys, persistKey]);

  return (
    <ResizableContext
      value={{ scope, orientation, createResizeHandler, persist, registerPanelCallback }}
    >
      <div
        ref={composeRefs(ref, scope)}
        className={cn(
          "flex min-h-0 min-w-0 overflow-hidden",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className,
        )}
        {...props}
      >
        <InstanceCounterProvider>{children}</InstanceCounterProvider>
      </div>
    </ResizableContext>
  );
};

type ResizablePanelProps = React.ComponentPropsWithRef<"div"> & {
  asChild?: boolean;
  onResize?: PanelOnResizeCallback;
};

const ResizablePanel = ({
  asChild,
  onResize,
  className,
  children,
  ...props
}: ResizablePanelProps) => {
  const index = useInstanceCounter();
  const { registerPanelCallback } = useResizableContext();

  useEffect(() => {
    if (onResize) {
      const unregister = registerPanelCallback(index, onResize);
      return () => {
        unregister();
      };
    }
  }, [index, onResize, registerPanelCallback]);

  const Component = asChild ? Slot : "div";
  return (
    <Component
      data-ui-resizable-panel={index}
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
  ref,
  onPointerDown,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: ResizableHandleProps) => {
  const { orientation, createResizeHandler, persist } = useResizableContext();
  const handleRef = useRef<HTMLDivElement>(null);
  const keyHandleRef = useRef<ResizeHandler | null>(null);

  const getAdjacentPanels = () => {
    const el = handleRef.current;
    if (!el) return { panelBefore: null, panelAfter: null };

    let panelBefore = el.previousElementSibling as HTMLElement | null;
    while (panelBefore && !panelBefore.hasAttribute("data-ui-resizable-panel")) {
      panelBefore = panelBefore.previousElementSibling as HTMLElement | null;
    }

    let panelAfter = el.nextElementSibling as HTMLElement | null;
    while (panelAfter && !panelAfter.hasAttribute("data-ui-resizable-panel")) {
      panelAfter = panelAfter.nextElementSibling as HTMLElement | null;
    }

    return { panelBefore, panelAfter };
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
      handler.apply(currentDelta);
    };

    const onDragEnd = () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      window.removeEventListener("pointermove", onDrag);
      persist();
    };

    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", onDragEnd, { once: true });
    window.addEventListener("pointercancel", onDragEnd, { once: true });
  };

  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => {
    onFocus?.(e);
    if (e.defaultPrevented) return;

    if (keyHandleRef.current) return;
    const { panelBefore, panelAfter } = getAdjacentPanels();
    if (!panelBefore || !panelAfter) return;
    keyHandleRef.current = createResizeHandler(panelBefore, panelAfter);
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    onBlur?.(e);
    if (e.defaultPrevented) return;

    persist();
    keyHandleRef.current = null;
  };

  const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const handler = keyHandleRef.current;
    if (!handler) return;

    const back = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (event.key === forward) {
      event.preventDefault();
      return handler.apply(KEYBOARD_ARROW_PX_STEP);
    }

    if (event.key === back) {
      event.preventDefault();
      return handler.apply(-KEYBOARD_ARROW_PX_STEP);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: hr element does not support after pseudo element
    <div
      // biome-ignore lint/a11y/useAriaPropsForRole: hr element does not support after pseudo element
      role="separator"
      aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
      tabIndex={0}
      ref={composeRefs(ref, handleRef)}
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
