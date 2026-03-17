import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '@/foundations/ui/modal/modal';
import { cn } from '@/lib/utils/classnames';

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
        '[--drawer-p:--spacing(4)]',
        'overflow-x-hidden! mx-auto flex w-full max-w-screen flex-col overflow-y-auto border border-border bg-background-high p-(--drawer-p) *:shrink-0',
        'has-[[data-modal-focus-catcher]:first-child+[data-drawer-header],[data-drawer-header]:first-child]:pt-0 has-[[data-drawer-actions]:last-child]:pb-0',
        'backdrop:bg-black/20 not-data-[status=open]:backdrop:opacity-0 backdrop:backdrop-blur-sm',
        // desktop
        'md:mr-0 md:h-full md:max-h-screen md:w-full md:max-w-lg md:not-data-[status=open]:translate-x-full',
        // mobile
        'min-h-[50svh] max-md:mb-0 max-md:max-h-[calc(100svh-(--spacing(16)))] max-md:w-full max-md:not-data-[status=open]:translate-y-full max-md:rounded-t-xl',
        // animation props
        'transition-transform ease-emphasized-decelerate not-data-[status=open]:ease-emphasized-accelerate',
        'backdrop:transition-opacity backdrop:ease-in-out',
        'motion-reduce:transition-none motion-reduce:backdrop:transition-none',
        'duration-400 not-data-[status=open]:duration-250 not-data-[status=open]:backdrop:delay-150 not-data-[status=open]:backdrop:duration-200',
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
    <ModalTitle className={cn('font-semibold', className)} {...props}>
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
    <ModalDescription className={cn('pb-2', className)} {...props}>
      {children}
    </ModalDescription>
  );
};

const DrawerBleed = ({
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  return <div className={cn('-mx-(--drawer-p)', className)} {...props} />;
};

const DrawerHeader = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <DrawerBleed
      className={cn(
        'sticky top-0 z-10 mb-(--drawer-p) border-border border-b bg-background p-(--drawer-p)',
        className
      )}
      {...props}
      data-drawer-header=""
    >
      {children}
    </DrawerBleed>
  );
};

const DrawerActions = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <DrawerBleed
      className={cn(
        'sticky bottom-0 mt-auto flex gap-2 border-border border-t bg-background p-(--drawer-p)',
        className
      )}
      {...props}
      data-drawer-actions=""
    >
      {children}
    </DrawerBleed>
  );
};

export {
  Drawer,
  DrawerActions,
  DrawerBleed,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
