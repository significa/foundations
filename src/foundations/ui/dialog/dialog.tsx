"use client";

import {
  createContext,
  useCallback,
  use,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingOptions,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "cva";

import { cn } from "@/lib/utils";
import { Button } from "@/foundations/ui/button/button";

interface UseDialogOptions {
  open?: boolean;
  onOpenChange?: UseFloatingOptions["onOpenChange"];
}

const useDialog = ({
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
}: UseDialogOptions) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(
    undefined
  );

  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback<NonNullable<UseFloatingOptions["onOpenChange"]>>(
    (open, event, reason) => {
      setInternalOpen(open);
      propsOnOpenChange?.(open, event, reason);
    },
    [propsOnOpenChange]
  );

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const context = floating.context;

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" }); // so that touch events become lazy and do not fall through the backdrop, as the default behavior is eager
  const role = useRole(context, { role: "dialog" });

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [
      open,
      setOpen,
      interactions,
      floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    ]
  );
};

type ContextType = ReturnType<typeof useDialog> | null;

const DialogContext = createContext<ContextType>(null);

const useDialogContext = () => {
  const context = use(DialogContext);

  if (context == null) {
    throw new Error("Dialog components must be wrapped in <Dialog />");
  }

  return context;
};

interface DialogProps extends UseDialogOptions {
  children: React.ReactNode;
}

/**
 * Dialog allows you to create modal dialogs that overlay the main content.
 *
 * @example
 * ```
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogTitle>Dialog Title</DialogTitle>
 *     <DialogDescription>This is a description of the dialog.</DialogDescription>
 *     <DialogActions>
 *       <DialogClose>
 *         <Button>Close</Button>
 *       </DialogClose>
 *     </DialogActions>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const Dialog = ({ children, ...options }: DialogProps) => {
  const dialog = useDialog(options);

  return <DialogContext value={dialog}>{children}</DialogContext>;
};

interface DialogTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

/**
 * Will open the dialog when clicked.
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <DialogTrigger asChild>
 *   <Button>Open Dialog</Button>
 * </DialogTrigger>
 *
 * <DialogTrigger>
 *   Open Dialog
 * </DialogTrigger>
 * ```
 */
const DialogTrigger = ({
  ref: refProp,
  children,
  asChild = false,
  ...props
}: DialogTriggerProps) => {
  const context = useDialogContext();
  const Comp = asChild ? Slot : FallbackButton;

  const ref = useMergeRefs([context.refs.setReference, refProp]);

  return (
    <Comp
      ref={ref}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </Comp>
  );
};

const dialogOverlayStyle = cva({
  base: "z-50 flex max-h-screen overflow-y-auto overscroll-contain bg-black/20 p-4 backdrop-blur-sm transition-all duration-100 ease-in-out data-[state=closed]:bg-black/0 data-[state=closed]:backdrop-blur-none",
  variants: {
    align: {
      center: "items-center justify-center",
      top: "items-start justify-center pt-16",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

interface DialogContentProps extends React.ComponentPropsWithRef<"div"> {
  wrapperClassName?: string;
  align?: VariantProps<typeof dialogOverlayStyle>["align"];
}

/**
 * Will render the dialog content.
 *
 * @example
 * ```
 * <DialogContent>
 *   <p>Dialog Content</p>
 * </DialogContent>
 * ```
 */
const DialogContent = ({
  ref: refProp,
  children,
  className,
  wrapperClassName,
  align,
  ...props
}: DialogContentProps) => {
  const { context, labelId, descriptionId, getFloatingProps } =
    useDialogContext();

  const ref = useMergeRefs([context.refs.setFloating, refProp]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: 150, // unmount after 150
  });

  const state = ["open", "initial"].includes(status) ? "open" : "closed";

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        data-state={state}
        className={cn(dialogOverlayStyle({ align }), wrapperClassName)}
      >
        <FloatingFocusManager context={context}>
          <div
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            ref={ref}
            data-state={state}
            {...getFloatingProps(props)}
            className={cn(
              "bg-background border-border w-full max-w-md rounded-3xl border p-4 shadow-lg",
              "max-h-[calc(100vh-2rem)] overflow-y-auto",
              "ease-out-quart transition-all",
              "data-[state=closed]:translate-y-2 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:duration-150 data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:duration-300",
              className
            )}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

interface DialogTitleProps extends React.ComponentPropsWithRef<"h2"> {
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Renders the title of the dialog.
 *
 * This component automatically sets the `aria-labelledby` attribute on the dialog element,
 * ensuring proper accessibility by connecting the title to the dialog content.
 *
 * @example
 * ```
 * <DialogTitle>Dialog Title</DialogTitle>
 * ```
 */
const DialogTitle = ({
  children,
  className,
  asChild,
  ...props
}: DialogTitleProps) => {
  const { setLabelId } = useDialogContext();

  const generatedId = useId();
  const id = props.id ?? generatedId;

  const Comp = asChild ? Slot : "h2";

  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <Comp {...props} id={id} className={cn("pb-2 font-semibold", className)}>
      {children}
    </Comp>
  );
};

interface DialogDescriptionProps extends React.ComponentPropsWithRef<"p"> {
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Renders a description for the dialog.
 *
 * This component automatically sets the `aria-describedby` attribute on the dialog element,
 * ensuring proper accessibility by connecting the description to the dialog content.
 *
 * @example
 * ```
 * <DialogDescription>This is a description of the dialog.</DialogDescription>
 * ```
 */
const DialogDescription = ({
  children,
  className,
  asChild,
  ...props
}: DialogDescriptionProps) => {
  const { setDescriptionId } = useDialogContext();

  const generatedId = useId();
  const id = props.id ?? generatedId;

  const Comp = asChild ? Slot : "p";

  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <Comp {...props} id={id} className={cn("text-foreground", className)}>
      {children}
    </Comp>
  );
};

/**
 * Renders a container for dialog action buttons.
 *
 * This component is designed to be placed at the bottom of the dialog content,
 * providing a consistent layout for action buttons such as "Cancel" and "Confirm".
 *
 * @example
 * ```
 * <DialogActions>
 *   <DialogClose asChild>
 *     <Button variant="secondary">Cancel</Button>
 *   </DialogClose>
 *   <Button>Confirm</Button>
 * </DialogActions>
 * ```
 */

const DialogActions = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "flex flex-col gap-2 pt-4 sm:flex-row sm:justify-start",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface DialogCloseProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

/**
 * Will close the dialog when clicked.
 *
 * Useful to dismiss the dialog from within (e.g.: dialog with a form and a cancel button).
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <DialogClose asChild>
 *   <Button>Cancel</Button>
 * </DialogClose>
 * ```
 */
const DialogClose = ({
  asChild = false,
  children,
  ...props
}: DialogCloseProps) => {
  const { setOpen } = useDialogContext();
  const Comp = asChild ? Slot : FallbackButton;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    setOpen(false);
  };

  return (
    <Comp {...props} onClick={handleClick}>
      {children}
    </Comp>
  );
};

const FallbackButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button type="button" variant="outline" {...props}>
      {children}
    </Button>
  );
};

export {
  useDialogContext,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogActions,
  DialogClose,
};
