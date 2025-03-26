"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ComponentPropsWithRef,
  createContext,
  ReactNode,
  use,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { easings } from "@/lib/easings";
import { cn } from "@/lib/utils";
import { Slot } from "@/foundations/components/slot/slot";

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
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Drawer = ({
  open: propOpen,
  defaultOpen,
  onOpenChange,
  children,
}: DrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);

  const open = propOpen ?? internalOpen;

  const setOpen = (open: boolean) => {
    setInternalOpen(open);
    onOpenChange?.(open);
  };

  return (
    <DrawerContext value={{ open, setOpen, labelId, setLabelId }}>
      {children}
    </DrawerContext>
  );
};

interface DrawerTriggerProps extends ComponentPropsWithRef<"button"> {
  children: ReactNode;
  asChild?: boolean;
}

const DrawerTrigger = ({ children, asChild, ...props }: DrawerTriggerProps) => {
  const { setOpen } = useDrawerContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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

interface DrawerCloseProps extends ComponentPropsWithRef<"button"> {
  children: ReactNode;
  asChild?: boolean;
}

const DrawerClose = ({ children, asChild, ...props }: DrawerCloseProps) => {
  const { setOpen } = useDrawerContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
    ComponentPropsWithRef<"dialog">,
    | "onDrag"
    | "onDragEnd"
    | "onDragStart"
    | "onDragEndCapture"
    | "onDragStartCapture"
    | "onAnimationStart"
  > {
  children: ReactNode;
}

const DrawerContent = ({ children, ...props }: DrawerContentProps) => {
  const { labelId, open, setOpen } = useDrawerContext();
  const ref = useRef<HTMLDialogElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const dialog = ref.current;

    if (dialog) {
      // use native showModal() to ensure receives focus when opened, and ESC closes it
      dialog.showModal();

      // listen for changes to the dialog's open state, to update the open state when its closed non-programmatically
      const mutationObserver = new MutationObserver(([mutation]) => {
        if (mutation.attributeName === "open") {
          setOpen(dialog.open);
        }
      });

      mutationObserver.observe(dialog, { attributes: true });
      return () => mutationObserver.disconnect();
    }
  }, [open, setOpen]);

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
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
      }
    }
  };

  return (
    <AnimatePresence initial={false}>
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
            "mx-auto flex w-full max-w-screen flex-col overflow-y-auto *:shrink-0",
            "bg-background border-border rounded-xl border",
            "max-md:mt-auto max-md:max-h-[calc(100vh-(--spacing(8)))] max-md:translate-y-(--transform) max-md:rounded-b-none max-md:border-b-0",
            "md:mr-0 md:h-full md:max-h-screen md:max-w-160 md:translate-x-(--transform) md:rounded-r-none md:border-r-0",
            "backdrop:bg-black/20 backdrop:opacity-(--backdrop-opacity) backdrop:backdrop-blur-sm",
            !reducedMotion && "will-change-transform",
            props.className
          )}
          onClick={handleDialogClick}
        >
          {children}
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};

interface DrawerHeaderProps extends ComponentPropsWithRef<"header"> {
  children: ReactNode;
  asChild?: boolean;
}

const DrawerHeader = ({ children, ...props }: DrawerHeaderProps) => {
  const Component = props.asChild ? Slot : "header";
  return (
    <Component
      {...props}
      className={cn(
        "bg-background border-border sticky top-0 rounded-t-xl border-b px-4 py-3.5",
        props.className
      )}
    >
      {children}
    </Component>
  );
};

interface DrawerTitleProps extends ComponentPropsWithRef<"h2"> {
  children: ReactNode;
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
      className={cn("text-foreground-secondary text-sm", props.className)}
    >
      {children}
    </Component>
  );
};

interface DrawerActionsProps extends ComponentPropsWithRef<"div"> {
  children: ReactNode;
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
};
