"use client";

import {
  AnimatePresence,
  motion,
  animate,
  useReducedMotion,
} from "motion/react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { easings } from "@/lib/easings";
import { cn } from "@/lib/utils";
import { Slot } from "@/foundations/components/slot/slot";
import {
  useScrollLock,
  ScrollLockTarget,
} from "@/foundations/hooks/use-scroll-lock/use-scroll-lock";
import { useStableCallback } from "@/foundations/hooks/use-stable-callback/use-stable-callback";

interface DrawerContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  labelId?: string;
  setLabelId: (labelId: string | undefined) => void;
}

const DrawerContext = createContext<DrawerContext | null>(null);

const useDrawerContext = () => {
  const context = use(DrawerContext);

  if (!context) {
    throw new Error("Drawer components must be wrapped in <Drawer />");
  }

  return context;
};

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  scrollLockTarget?: ScrollLockTarget;
}

const Drawer = ({
  open: propOpen,
  defaultOpen,
  onOpenChange,
  children,
  scrollLockTarget,
}: DrawerProps) => {
  const stableOnOpenChange = useStableCallback(onOpenChange);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const open = propOpen ?? internalOpen;

  const setOpen = useCallback(
    (open: boolean) => {
      setInternalOpen(open);
      stableOnOpenChange?.(open);
    },
    [stableOnOpenChange]
  );

  useScrollLock(open, scrollLockTarget);

  return (
    <DrawerContext value={{ open, setOpen, labelId, setLabelId }}>
      {children}
    </DrawerContext>
  );
};

interface DrawerTriggerProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerTrigger = ({ children, asChild, ...props }: DrawerTriggerProps) => {
  const { setOpen } = useDrawerContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event);

    if (!event.defaultPrevented) {
      setOpen(true);
    }
  };

  const Component = asChild ? Slot : "button";
  return (
    <Component {...props} onClick={handleClick}>
      {children}
    </Component>
  );
};

interface DrawerCloseProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerClose = ({ children, asChild, ...props }: DrawerCloseProps) => {
  const { setOpen } = useDrawerContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event);

    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  const Component = asChild ? Slot : "button";
  return (
    <Component {...props} onClick={handleClick}>
      {children}
    </Component>
  );
};

/**
 * We're pretty close to being able to do a fully native implementation (using @starting-style and allow-discrete transition behaviour).
 * At the moment, the only blocker is the limited availability of @starting-style in firefox:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
 *
 * Let's keep an eye on it and swap motion/react for CSS transitions when it reaches baseline browser support.
 */

const variants = {
  open: {
    "--transform": "0%",
    "--backdrop-opacity": 1,
    transition: {
      "--transform": { duration: 0.4, ease: easings["emphasized-decelerate"] },
      "--backdrop-opacity": { duration: 0.4 },
    },
  },
  closed: {
    "--transform": "100%",
    "--backdrop-opacity": 0,
    transition: {
      "--transform": { duration: 0.25, ease: easings["emphasized-accelerate"] },
      "--backdrop-opacity": { duration: 0.4, delay: 0.1 },
    },
  },
};

interface DrawerContentProps
  extends Omit<
    React.ComponentPropsWithRef<"dialog">,
    | "open"
    | "onDrag"
    | "onDragEnd"
    | "onDragStart"
    | "onDragEndCapture"
    | "onDragStartCapture"
    | "onAnimationStart"
  > {
  children: React.ReactNode;
  persistExitAnimation?: boolean;
}

const DrawerContent = ({
  children,
  persistExitAnimation,
  ...props
}: DrawerContentProps) => {
  const reducedMotion = useReducedMotion();
  const { labelId, open, setOpen } = useDrawerContext();
  const ref = useRef<HTMLDialogElement>(null);
  const hasCompletedExitAnimation = useRef(false);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (!dialog.open) {
      // use native showModal() to ensure it receives focus when opened, and ESC closes it
      dialog.showModal();
    }

    // prevent the default cancel event and use internal state to close the drawer instead
    // this ensures drawer closing is synchronized with internal state, preventing layout shifts
    const onCancel = (event: Event) => {
      event.preventDefault();
      setOpen(false);
    };

    dialog.addEventListener("cancel", onCancel);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      hasCompletedExitAnimation.current = false;
    }

    const dialog = ref.current;
    if (reducedMotion || !persistExitAnimation || !dialog) return;

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const isUnmounting = !!dialog && !ref.current;
      const isIncompleteExitAnimation = !hasCompletedExitAnimation.current;

      // if persistExitAnimation is true and the component is unmounting with an incomplete exit animation,
      // we clone the dialog onto the body and run the exit animation before removing it
      if (isUnmounting && isIncompleteExitAnimation) {
        const clone = dialog.cloneNode(true) as typeof dialog;
        clone.setAttribute("inert", "");
        document.body.appendChild(clone);

        // close and open as modal, because when an open dialog is cloned it loses its modal state
        clone.close();
        clone.showModal();

        // @ts-expect-error animating css variables
        animate(clone, variants.closed, variants.closed.transition).then(() => {
          clone.remove();
        });
      }
    };
  }, [open, persistExitAnimation, reducedMotion]);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // if the click is on the backdrop, close the drawer
    if ((event.target as HTMLElement).nodeName === "DIALOG") {
      const dialog = event.target as HTMLDialogElement;
      const { top, left, width, height } = dialog.getBoundingClientRect();
      const isOutsideDialog =
        top > event.clientY ||
        event.clientY > top + height ||
        left > event.clientX ||
        event.clientX > left + width;

      if (isOutsideDialog) {
        setOpen(false);
        event.stopPropagation();
      }
    }
  };

  return (
    <AnimatePresence
      initial={false}
      onExitComplete={() => (hasCompletedExitAnimation.current = true)}
    >
      {open && (
        <motion.dialog
          {...props}
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          initial="closed"
          animate="open"
          exit="closed"
          variants={!reducedMotion ? variants : {}}
          className={cn(
            "bg-background-high border-border mx-auto flex w-full max-w-screen flex-col overflow-y-auto border *:shrink-0",
            "max-md:mt-auto max-md:max-h-[calc(100dvh-(--spacing(12)))] max-md:translate-y-(--transform) max-md:rounded-xl max-md:rounded-b-none max-md:border-b-0",
            "md:mr-0 md:h-full md:max-h-screen md:max-w-160 md:translate-x-(--transform) md:border-0 md:border-l",
            "backdrop:bg-black/20 backdrop:opacity-(--backdrop-opacity) backdrop:backdrop-blur-sm",
            !reducedMotion && "will-change-transform",
            props.className
          )}
          onClick={handleDialogClick}
        >
          {/* catch focus on safari  to avoid the focused element having a focus-visible outline */}
          {/* we can remove it if apple ever fixes this */}
          <div
            className="safari:block sr-only hidden"
            aria-hidden="true"
            autoFocus
            tabIndex={-1}
          />
          {children}
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};

interface DrawerHeaderProps extends React.ComponentPropsWithRef<"header"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerHeader = ({ children, ...props }: DrawerHeaderProps) => {
  const Component = props.asChild ? Slot : "header";
  return (
    <Component
      {...props}
      className={cn(
        "bg-background border-border sticky top-0 z-10 border-b p-3.5",
        props.className
      )}
    >
      {children}
    </Component>
  );
};

interface DrawerTitleProps extends React.ComponentPropsWithRef<"h2"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerTitle = ({ children, ...props }: DrawerTitleProps) => {
  const { setLabelId } = useDrawerContext();

  const generatedId = useId();
  const id = props.id ?? generatedId;

  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  const Component = props.asChild ? Slot : "p";
  return (
    <Component
      {...props}
      id={id}
      className={cn("text-sm font-medium", props.className)}
    >
      {children}
    </Component>
  );
};

interface DrawerMainProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const DrawerMain = ({
  children,
  className,
  asChild,
  ...props
}: DrawerMainProps) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component {...props} className={cn("p-3.5", className)}>
      {children}
    </Component>
  );
};

interface DrawerActionsProps extends React.ComponentPropsWithRef<"div"> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerActions = ({ children, ...props }: DrawerActionsProps) => {
  const Component = props.asChild ? Slot : "div";
  return (
    <Component
      {...props}
      className={cn(
        "bg-background border-border sticky bottom-0 mt-auto flex gap-2 border-t p-3.5 max-md:pb-4.5",
        props.className
      )}
    >
      {children}
    </Component>
  );
};

export {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerActions,
  DrawerMain,
};
