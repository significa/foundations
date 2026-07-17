import {
  createContext,
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

const KEYBOARD_ARROW_PX_STEP = 10;

type Orientation = "horizontal" | "vertical";

type ResizeHandler = {
  apply: (pxDelta: number) => void;
};

type ResizableContextValue = {
  orientation: Orientation;
  scope: React.RefObject<HTMLDivElement | null>;
  createResizeHandler: (index: number) => ResizeHandler;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

const useResizableContext = () => {
  const context = use(ResizableContext);
  if (!context) throw new Error("Resizable components must be used within a Resizable");
  return context;
};

type ResizableProps = Omit<React.ComponentPropsWithRef<"div">, "onResize"> & {
  orientation?: Orientation;
  children: React.ReactNode;
};

const Resizable = ({
  orientation = "horizontal",
  className,
  children,
  ref,
  ...props
}: ResizableProps) => {
  const scope = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLElement[]>([]);

  const keys = useMemo(() => {
    return {
      side: orientation === "horizontal" ? "width" : "height",
      sideOffset: orientation === "horizontal" ? "offsetWidth" : "offsetHeight",
      clientOffset: orientation === "horizontal" ? "clientX" : "clientY",
    } as const;
  }, [orientation]);

  const createResizeHandler = useCallback(
    (handleIndex: number) => {
      const root = scope.current;
      const panelBefore = panels.current[handleIndex - 1];
      const panelAfter = panels.current[handleIndex];

      if (!root || !panelBefore || !panelAfter) {
        return { apply: () => undefined };
      }

      // sizes when drag started
      const rootCurrent = root[keys.sideOffset];
      const panelBeforeCurrent = panelBefore.getBoundingClientRect()[keys.side];
      const panelAfterCurrent = panelAfter.getBoundingClientRect()[keys.side];

      const calcPanelRange = (panel: HTMLElement, oppositePanel: HTMLElement) => {
        const key = orientation === "horizontal" ? "width" : "height";
        const previousStyles = {
          panel: panel.style[key],
          oppositePanel: oppositePanel.style[key],
        };

        panel.style[key] = "0rem";
        oppositePanel.style[key] = "999rem";
        const min = panel.getBoundingClientRect()[key];
        panel.style[key] = "999rem";
        oppositePanel.style[key] = "0rem";
        const max = panel.getBoundingClientRect()[key];

        panel.style[key] = previousStyles.panel;
        oppositePanel.style[key] = previousStyles.oppositePanel;

        return { min, max };
      };

      // size range for each panel
      const panelBeforeRange = calcPanelRange(panelBefore, panelAfter);
      const panelAfterRange = calcPanelRange(panelAfter, panelBefore);

      const apply = (pxDelta: number) => {
        const panelBeforeNew = panelBeforeCurrent + pxDelta;
        const panelAfterNew = panelAfterCurrent - pxDelta;

        // check if new size is within range
        if (panelBeforeNew < panelBeforeRange.min) return;
        if (panelAfterNew < panelAfterRange.min) return;
        if (panelBeforeNew > panelBeforeRange.max) return;
        if (panelAfterNew > panelAfterRange.max) return;

        panelBefore.style[keys.side] = `${(panelBeforeNew / rootCurrent) * 100}%`;
        panelAfter.style[keys.side] = `${(panelAfterNew / rootCurrent) * 100}%`;
      };

      return { apply };
    },
    [keys, orientation],
  );

  // init and memo panels
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    panels.current = [...root.querySelectorAll<HTMLElement>("[data-ui-resizable-panel]")];

    // Normalize panels widths: each panel gets fraction of the total width
    for (const panel of panels.current) {
      const size = panel[keys.sideOffset];

      setTimeout(() => {
        panel.style.width = `${(size / root.offsetWidth) * 100}%`;
      }, 0);
    }
  }, [keys]);

  return (
    <ResizableContext value={{ scope, orientation, createResizeHandler }}>
      <div
        ref={composeRefs(ref, scope)}
        className={cn(
          "flex overflow-hidden",
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
};

const ResizablePanel = ({ asChild, className, style, children, ...props }: ResizablePanelProps) => {
  const index = useInstanceCounter();

  const Component = asChild ? Slot : "div";
  return (
    <>
      {/* Every panel but the first owns the handle on its leading edge. */}
      {index !== 0 && <ResizableHandle index={index} />}
      <Component
        data-ui-resizable-panel=""
        className={cn("w-full grow overflow-auto", className)}
        {...props}
      >
        {children}
      </Component>
    </>
  );
};

type ResizableHandleProps = {
  index: number;
};

const ResizableHandle = ({ index }: ResizableHandleProps) => {
  const { orientation, createResizeHandler } = useResizableContext();

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const clientOffset = orientation === "horizontal" ? "clientX" : "clientY";
    const startOffset = event[clientOffset];
    const handler = createResizeHandler(index);

    const onDrag = ({ [clientOffset]: offset }: PointerEvent) => {
      const delta = offset - startOffset;
      handler.apply(delta);
    };

    const onDragEnd = () => {
      window.removeEventListener("pointermove", onDrag);
    };

    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", onDragEnd, { once: true });
  };

  const onKeydown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const handler = createResizeHandler(index);

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
      aria-orientation={orientation}
      tabIndex={0}
      className={cn(
        "relative border-border border-l",
        "hover:border-foreground/24 hover:border-dashed active:border-foreground/48 active:border-dashed",
        "after:absolute after:inset-0",
        orientation === "horizontal"
          ? "h-full w-px cursor-col-resize border-l after:-inset-x-2"
          : "h-px w-full cursor-row-resize border-t after:-inset-y-2",
      )}
      onPointerDown={onPointerDown}
      onKeyDown={onKeydown}
    />
  );
};

const CompoundResizable = Object.assign(Resizable, {
  Panel: ResizablePanel,
});

export { CompoundResizable as Resizable, type ResizablePanelProps, type ResizableProps };
