"use client";

import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalTitle,
  ModalDescription,
} from "@/foundations/ui/modal/modal";
import { cn } from "@/lib/utils";

type DialogProps = React.ComponentProps<typeof Modal>;

const Dialog = ({ ...props }: DialogProps) => {
  return <Modal {...props} />;
};

interface DialogContentProps extends React.ComponentProps<typeof ModalContent> {
  align?: "center" | "top";
}

const DialogContent = ({
  className,
  children,
  align = "center",
  ...props
}: DialogContentProps) => {
  return (
    <ModalContent
      className={cn(
        "bg-background border-border m-auto w-full max-w-md rounded-3xl border p-4 shadow-lg",
        "max-h-[calc(100svh-2rem)] overflow-y-auto backdrop:bg-black/20 backdrop:backdrop-blur-sm",
        "transition-all duration-300 backdrop:transition-all motion-reduce:transition-none motion-reduce:backdrop:transition-none",
        "not-data-[status=open]:translate-y-2 not-data-[status=open]:scale-95 not-data-[status=open]:opacity-0 not-data-[status=open]:duration-150 not-data-[status=open]:backdrop:opacity-0",
        align === "top" && "mt-4",
        className
      )}
      {...props}
    >
      {children}
    </ModalContent>
  );
};

const DialogTrigger = ModalTrigger;

const DialogClose = ModalClose;

const DialogTitle = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ModalTitle>) => {
  return (
    <ModalTitle className={cn("pb-2 font-semibold", className)} {...props}>
      {children}
    </ModalTitle>
  );
};

const DialogDescription = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ModalDescription>) => {
  return (
    <ModalDescription className={cn("pb-2", className)} {...props}>
      {children}
    </ModalDescription>
  );
};

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

export {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogActions,
};
