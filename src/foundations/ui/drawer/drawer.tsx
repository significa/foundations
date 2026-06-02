import { Modal } from '@/foundations/ui/modal/modal';
import { cn, cva } from '@/lib/utils/classnames';

type DrawerProps = React.ComponentProps<typeof Modal>;

const Drawer = (props: DrawerProps) => {
  return <Modal {...props} />;
};

type DrawerSide = 'left' | 'right' | 'bottom' | 'left-bottom' | 'right-bottom';

const drawerContentStyle = cva({
  base: [
    '[--drawer-detach:calc(var(--radius)*3*var(--radius-bump))] [--drawer-p:--spacing(4)] [--drawer-stack:--spacing(4)]',
    'overflow-x-hidden! flex w-full max-w-screen flex-col overflow-y-auto border border-border bg-background p-(--drawer-p) *:shrink-0',
    'has-[[data-modal-focus-catcher]:first-child+[data-drawer-header],[data-drawer-header]:first-child]:pt-0 has-[[data-drawer-actions]:last-child]:pb-0',
    'rounded-2xl',
    'has-data-[status=open]:opacity-80 [&>:not(dialog)]:transition-opacity has-data-[status=open]:[&>:not(dialog)]:opacity-0',
    'backdrop:bg-black/20 in-data-[status=open]:backdrop:opacity-0 not-data-[status=open]:backdrop:opacity-0 backdrop:backdrop-blur-sm',
    'transition-[translate,margin,opacity] ease-emphasized-decelerate not-data-[status=open]:ease-emphasized-accelerate',
    'backdrop:transition-opacity backdrop:ease-in-out',
    'motion-reduce:transition-none motion-reduce:backdrop:transition-none',
    'duration-400 not-data-[status=open]:duration-250 not-data-[status=open]:backdrop:delay-150 not-data-[status=open]:backdrop:duration-200',
  ],
  variants: {
    side: {
      right:
        'my-(--drawer-detach) mr-(--drawer-detach) ml-auto h-[calc(100dvh-2*var(--drawer-detach))] max-h-none max-w-lg not-data-[status=open]:translate-x-full has-data-[status=open]:mr-[calc(var(--drawer-detach)+var(--drawer-stack))]',
      left: 'my-(--drawer-detach) mr-auto ml-(--drawer-detach) h-[calc(100dvh-2*var(--drawer-detach))] max-h-none max-w-lg not-data-[status=open]:-translate-x-full has-data-[status=open]:ml-[calc(var(--drawer-detach)+var(--drawer-stack))]',
      bottom:
        'mx-(--drawer-detach) mt-auto mb-(--drawer-detach) max-h-[calc(100svh-(--spacing(16)))] min-h-[50svh] w-[calc(100%-2*var(--drawer-detach))] not-data-[status=open]:translate-y-full has-data-[status=open]:mb-[calc(var(--drawer-detach)+var(--drawer-stack))]',
      'right-bottom': [
        'md:my-(--drawer-detach) md:mr-(--drawer-detach) md:ml-auto md:h-[calc(100dvh-2*var(--drawer-detach))] md:max-h-none md:max-w-lg md:not-data-[status=open]:translate-x-full md:has-data-[status=open]:mr-[calc(var(--drawer-detach)+var(--drawer-stack))]',
        'max-md:mx-(--drawer-detach) max-md:mt-auto max-md:mb-(--drawer-detach) max-md:max-h-[calc(100svh-(--spacing(16)))] max-md:min-h-[50svh] max-md:w-[calc(100%-2*var(--drawer-detach))] max-md:not-data-[status=open]:translate-y-full max-md:has-data-[status=open]:mb-[calc(var(--drawer-detach)+var(--drawer-stack))]',
      ],
      'left-bottom': [
        'md:my-(--drawer-detach) md:mr-auto md:ml-(--drawer-detach) md:h-[calc(100dvh-2*var(--drawer-detach))] md:max-h-none md:max-w-lg md:not-data-[status=open]:-translate-x-full md:has-data-[status=open]:ml-[calc(var(--drawer-detach)+var(--drawer-stack))]',
        'max-md:mx-(--drawer-detach) max-md:mt-auto max-md:mb-(--drawer-detach) max-md:max-h-[calc(100svh-(--spacing(16)))] max-md:min-h-[50svh] max-md:w-[calc(100%-2*var(--drawer-detach))] max-md:not-data-[status=open]:translate-y-full max-md:has-data-[status=open]:mb-[calc(var(--drawer-detach)+var(--drawer-stack))]',
      ],
    } satisfies Record<DrawerSide, string | string[]>,
  },
  defaultVariants: {
    side: 'right-bottom',
  },
});

interface DrawerContentProps
  extends React.ComponentProps<typeof Modal.Content> {
  side?: DrawerSide;
}

const DrawerContent = ({
  className,
  children,
  side = 'right-bottom',
  ...props
}: DrawerContentProps) => {
  return (
    <Modal.Content
      data-side={side}
      className={cn(drawerContentStyle({ side }), className)}
      {...props}
    >
      {children}
    </Modal.Content>
  );
};

const DrawerTrigger = Modal.Trigger;

const DrawerClose = Modal.Close;

const DrawerTitle = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Modal.Title>) => {
  return (
    <Modal.Title className={cn('font-semibold', className)} {...props}>
      {children}
    </Modal.Title>
  );
};

const DrawerDescription = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Modal.Description>) => {
  return (
    <Modal.Description className={cn('pb-2', className)} {...props}>
      {children}
    </Modal.Description>
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
        'sticky bottom-0 mt-auto flex gap-(--drawer-p) border-border border-t bg-background p-(--drawer-p)',
        className
      )}
      {...props}
      data-drawer-actions=""
    >
      {children}
    </DrawerBleed>
  );
};

const CompoundDrawer = Object.assign(Drawer, {
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Actions: DrawerActions,
  Bleed: DrawerBleed,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
});

export { CompoundDrawer as Drawer };
