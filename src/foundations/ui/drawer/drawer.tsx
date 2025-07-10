import { cn } from "@/lib/utils";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from "@/foundations/ui/modal/modal";

type DrawerProps = React.ComponentProps<typeof Modal>;

const Drawer = (props: DrawerProps) => {
  return <Modal {...props} />;
};

type DrawerContentProps = React.ComponentProps<typeof ModalContent>;

const DrawerContent = ({
  className,
  children,
  ...props
}: DrawerContentProps) => {
  return (
    <ModalContent
      className={cn(
        "[--padding:--spacing(4)]",
        "bg-background-high border-border mx-auto flex w-full max-w-screen flex-col overflow-y-auto border p-(--padding) *:shrink-0",
        "backdrop:bg-black/20 backdrop:backdrop-blur-sm not-data-[status=open]:backdrop:opacity-0",
        // desktop
        "md:mr-0 md:h-full md:max-h-screen md:w-full md:max-w-128 md:not-data-[status=open]:translate-x-full",
        // mobile
        "min-h-[50svh] max-md:mb-0 max-md:max-h-[calc(100svh-4rem)] max-md:w-full max-md:rounded-t-xl max-md:not-data-[status=open]:translate-y-full",
        // animation props
        "ease-emphasized-decelerate not-data-[status=open]:ease-emphasized-accelerate transition-transform",
        "backdrop:transition-opacity backdrop:ease-in-out",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
        "duration-400 not-data-[status=open]:duration-250 not-data-[status=open]:backdrop:delay-150 not-data-[status=open]:backdrop:duration-200",
        className
      )}
      {...props}
    >
      {children}
    </ModalContent>
  );
};

const DrawerTrigger = ModalTrigger;

const DrawerClose = ModalClose;

const DrawerTitle = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ModalTitle>) => {
  return (
    <ModalTitle className={cn("font-semibold", className)} {...props}>
      {children}
    </ModalTitle>
  );
};

const DrawerDescription = ({
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

// Don't very much like having this
const DrawerBleed = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn(
        "relative -mx-(--padding) w-[calc(100%+2*var(--padding))]",
        className
      )}
      {...props}
    />
  );
};

const DrawerHeader = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <DrawerBleed
      className={cn(
        "bg-background border-border sticky -top-(--padding) z-10 -mt-(--padding) mb-(--padding) border-b p-(--padding)",
        className
      )}
      {...props}
    >
      {children}
    </DrawerBleed>
  );
};

const DrawerActions = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <DrawerBleed
      className={cn(
        "bg-background border-border sticky -bottom-(--padding) mt-auto -mb-(--padding) border-t p-(--padding)",
        className
      )}
      {...props}
    >
      {children}
    </DrawerBleed>
  );
};

export {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerBleed,
  DrawerHeader,
  DrawerActions,
};
