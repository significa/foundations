"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { useElementTransition } from "@/foundations/hooks/use-element-transition/use-element-transition";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils";

// Hook to manage native <dialog> element behavior
const useDialogElement = (
  open: boolean,
  setOpen: (isOpen: boolean) => void
) => {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!element.open) {
      // use native showModal() to ensure it receives focus when opened, and ESC closes it
      element.showModal();
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    // Prevent the default cancel event and use internal state to close the drawer instead
    // This ensures drawer closing is synchronized with internal state, preventing layout shifts
    element.addEventListener(
      "cancel",
      (event: Event) => {
        event.preventDefault();
        setOpen(false);
      },
      { signal }
    );

    // Prevent ESC from closing the dialog when the cancel event is prevented.
    // Unsure if this is a browser bug or intended behavior — the ESC key can push through the cancel event for some reason
    element.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
        }
      },
      { signal }
    );

    // Prevent ESC from closing the dialog when it is inert.
    // If the dialog is opened while inert, the focus goes to the window, which allows ESC to close the dialog unexpectedly.
    window.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && element.inert && open) {
          event.preventDefault();
          setOpen(false);
        }
      },
      { signal }
    );

    return () => {
      abortController.abort();
    };
  }, [open, ref, setOpen]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !open) return;

    const handleDialogClick = (event: MouseEvent) => {
      // if the click is on the backdrop, close the drawer
      if ((event.target as HTMLElement).nodeName === "DIALOG") {
        const dialog = event.target as HTMLDialogElement;
        const { top, left, width, height } = dialog.getBoundingClientRect();
        const isOutsideModal =
          top > event.clientY ||
          event.clientY > top + height ||
          left > event.clientX ||
          event.clientX > left + width;

        if (isOutsideModal) {
          event.stopPropagation();
          setOpen(false);
        }
      }
    };

    element.addEventListener("click", handleDialogClick);

    return () => {
      element.removeEventListener("click", handleDialogClick);
    };
  }, [setOpen, open]);

  return ref;
};

const ModalContext = createContext<{
  open: boolean;
  labelId?: string;
  descriptionId?: string;
  setOpen: (open: boolean) => void;
  setLabelId: (id?: string) => void;
  setDescriptionId: (id?: string) => void;
} | null>(null);

const useModalContext = () => {
  const context = use(ModalContext);

  if (!context) {
    throw new Error("Modal component must be used within a Modal");
  }

  return context;
};

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ open: propsOpen, onOpenChange, children }: ModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(
    undefined
  );

  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback(
    (isOpen: boolean) => {
      setInternalOpen(isOpen);
      onOpenChange?.(isOpen);
    },
    [onOpenChange]
  );

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      labelId,
      setLabelId,
      descriptionId,
      setDescriptionId,
    }),
    [descriptionId, labelId, open, setOpen]
  );

  return <ModalContext value={ctx}>{children}</ModalContext>;
};

interface ModalContentProps extends React.ComponentPropsWithRef<"dialog"> {
  catchFocus?: boolean;
}

const ModalContent = ({
  className,
  children,
  catchFocus = true,
  ...props
}: ModalContentProps) => {
  const { open, labelId, descriptionId, setOpen } = useModalContext();
  const dialogRef = useDialogElement(open, setOpen);

  const {
    ref: transitionRef,
    isMounted,
    status,
  } = useElementTransition<HTMLDialogElement>(open);

  if (!isMounted) return;

  return (
    <dialog
      ref={composeRefs(dialogRef, transitionRef)}
      data-status={status}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className={cn("m-auto", className)}
      {...props}
    >
      {catchFocus && (
        // By default, the HTML <dialog> element focuses the first focusable child when opened.
        // If that element is scrolled out of view, the dialog may jump to it, causing a jarring and confusing scroll.
        // Additionally, browsers like Safari may show focus-visible styles on that element, which can look odd.
        // The following element catches initial focus to prevent these issues.
        <div
          className="sr-only"
          autoFocus
          tabIndex={-1}
          data-modal-focus-catcher=""
        />
      )}
      {children}
    </dialog>
  );
};

interface ModalTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const ModalTrigger = ({ asChild, children, ...props }: ModalTriggerProps) => {
  const { setOpen } = useModalContext();

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

interface ModalCloseProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const ModalClose = ({
  asChild = false,
  children,
  ...props
}: ModalCloseProps) => {
  const { setOpen } = useModalContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);

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

interface ModalTitleProps extends React.ComponentPropsWithRef<"h2"> {
  asChild?: boolean;
}

const ModalTitle = ({ children, asChild, ...props }: ModalTitleProps) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const { setLabelId } = useModalContext();

  useLayoutEffect(() => {
    setLabelId(id);

    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  const Component = asChild ? Slot : "h2";
  return (
    <Component id={id} {...props}>
      {children}
    </Component>
  );
};

interface ModalDescriptionProps extends React.ComponentPropsWithRef<"p"> {
  asChild?: boolean;
}

const ModalDescription = ({
  children,
  asChild,
  ...props
}: ModalDescriptionProps) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const { setDescriptionId } = useModalContext();

  useLayoutEffect(() => {
    setDescriptionId(id);

    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  const Component = asChild ? Slot : "p";
  return (
    <Component id={id} {...props}>
      {children}
    </Component>
  );
};

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
};
