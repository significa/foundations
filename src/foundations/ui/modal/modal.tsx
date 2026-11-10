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

import { Slot } from "#/foundations/components/slot/slot.tsx";
import { useElementTransition } from "#/foundations/hooks/use-element-transition/use-element-transition.ts";
import { composeRefs } from "#/foundations/utils/compose-refs/compose-refs.ts";
import { cn } from "#/lib/utils/classnames.ts";

// Hook to manage native <dialog> element behavior
const useDialogElement = (
  open: boolean,
  setOpen: (isOpen: boolean) => void,
  dismissible: boolean,
  isMounted: boolean,
) => {
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<Element | null>(null);

  // Emit modal-open or modal-close custom event when the dialog is opened or closed,
  // so other components can react to it
  useEffect(() => {
    const origin = ref.current;
    if (!origin) return;

    const openEvent = new CustomEvent(open ? "ui:modal-open" : "ui:modal-close", {
      detail: { origin: ref.current },
    });
    window.dispatchEvent(openEvent);
  }, [open]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (open && !element.open) {
      openerRef.current = document.activeElement;
      // use native showModal() to ensure it receives focus when opened, and ESC closes it
      element.showModal();
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    // Prevent the native close and drive it through state instead, so the exit
    // transition can run. The cancel event fires only on the topmost dialog and
    // does not bubble. An uncancelable cancel (close watchers: a repeated close
    // request without user activation) closes anyway; the close listener follows it.
    element.addEventListener(
      "cancel",
      (event: Event) => {
        if (!event.cancelable) return;
        event.preventDefault();
        if (dismissible) setOpen(false);
      },
      { signal },
    );

    // The browser closed the dialog itself: keep state in step. Only while open,
    // so a close we already made doesn't call onOpenChange(false) twice.
    element.addEventListener(
      "close",
      () => {
        if (open) setOpen(false);
      },
      { signal },
    );

    // ESC can push past a prevented cancel and close natively, dropping the
    // dialog from the top layer mid-transition. stopPropagation keeps the
    // keydown from reaching ancestor dialogs when modals are nested in the DOM.
    element.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && !event.isComposing && open) {
          event.preventDefault();
          event.stopPropagation();
          if (dismissible) setOpen(false);
        }
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  }, [open, setOpen, dismissible]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !open || !dismissible) return;

    // A click on this <dialog> itself, outside its box, is on its backdrop. Not any
    // dialog: a nested dialog's backdrop click bubbles here and must not close this one.
    const isOnBackdrop = (event: MouseEvent) => {
      if (event.target !== element) return false;
      const { top, left, width, height } = element.getBoundingClientRect();
      return (
        top > event.clientY ||
        event.clientY > top + height ||
        left > event.clientX ||
        event.clientX > left + width
      );
    };

    // The press must start on the backdrop too: a text selection released outside isn't a dismiss
    let pressedOnBackdrop = false;
    const handlePointerDown = (event: PointerEvent) => {
      pressedOnBackdrop = isOnBackdrop(event);
    };
    const handleClick = (event: MouseEvent) => {
      if (!pressedOnBackdrop || !isOnBackdrop(event)) return;
      event.stopPropagation();
      setOpen(false);
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("click", handleClick);
    };
  }, [setOpen, open, dismissible]);

  // The dialog is removed after its exit transition without close(), so the
  // browser never returns focus to the opener: do it when it leaves the page.
  useEffect(() => {
    if (!isMounted) return;

    return () => {
      const opener = openerRef.current;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isMounted]);

  return ref;
};

const ModalContext = createContext<{
  open: boolean;
  dismissible: boolean;
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
  dismissible?: boolean;
  children: React.ReactNode;
}

const Modal = ({ open: propsOpen, onOpenChange, dismissible = true, children }: ModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);

  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback(
    (isOpen: boolean) => {
      setInternalOpen(isOpen);
      onOpenChange?.(isOpen);
    },
    [onOpenChange],
  );

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      dismissible,
      labelId,
      setLabelId,
      descriptionId,
      setDescriptionId,
    }),
    [descriptionId, labelId, open, setOpen, dismissible],
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
  ref,
  ...props
}: ModalContentProps) => {
  const { open, dismissible, labelId, descriptionId, setOpen } = useModalContext();
  const { ref: transitionRef, isMounted, status } = useElementTransition<HTMLDialogElement>(open);
  const dialogRef = useDialogElement(open, setOpen, dismissible, isMounted);
  // Memoised: a new ref each render would detach and re-attach the dialog's refs on every render.
  const composedRef = useMemo(
    () => composeRefs(dialogRef, transitionRef, ref),
    [dialogRef, transitionRef, ref],
  );

  if (!isMounted) return null;

  return (
    <dialog
      ref={composedRef}
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
        <div className="sr-only" autoFocus tabIndex={-1} data-modal-focus-catcher="" />
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
    <Component type={asChild ? undefined : "button"} {...props} onClick={handleClick}>
      {children}
    </Component>
  );
};

interface ModalCloseProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const ModalClose = ({ asChild = false, children, ...props }: ModalCloseProps) => {
  const { setOpen } = useModalContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event);

    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  const Component = asChild ? Slot : "button";
  return (
    <Component type={asChild ? undefined : "button"} {...props} onClick={handleClick}>
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

const ModalDescription = ({ children, asChild, ...props }: ModalDescriptionProps) => {
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

const CompoundModal = Object.assign(Modal, {
  Content: ModalContent,
  Trigger: ModalTrigger,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});

export { CompoundModal as Modal };
