import { CheckCircleIcon, XCircleIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useSyncExternalStore } from 'react';
import { useTopLayer } from '@/foundations/hooks/use-top-layer/use-top-layer';
import { cn } from '@/lib/utils/classnames';

const DEFAULT_TOAST_DURATION_MS = 7000;

type ToastVariant = 'default' | 'positive' | 'negative';

type Toast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
};

type ToastStore = {
  toasts: Toast[];
  subscribe: (listener: () => void) => () => void;
  add: (config: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
  pauseAll: () => void;
  resumeAll: () => void;
};

const createToastStore = (): ToastStore => {
  let toasts: Toast[] = [];
  const listeners = new Set<() => void>();

  const timers = new Map<
    string,
    {
      startTime: number;
      remainingTime: number;
      timeoutId: ReturnType<typeof setTimeout> | null;
    }
  >();

  const getToastId = () => {
    return Date.now().toString() + Math.random().toString(36).slice(2, 9);
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  return {
    get toasts() {
      return toasts;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add(toastData) {
      const id = getToastId();
      const newToast = { ...toastData, id };

      toasts = [...toasts, newToast];
      notifyListeners();

      const duration = toastData.duration ?? DEFAULT_TOAST_DURATION_MS;

      const timeout =
        duration !== Infinity
          ? setTimeout(() => this.remove(id), duration)
          : null;

      timers.set(id, {
        startTime: Date.now(),
        remainingTime: duration,
        timeoutId: timeout,
      });
    },
    remove(id) {
      toasts = toasts.filter((toast) => toast.id !== id);
      notifyListeners();

      const timer = timers.get(id);
      if (timer?.timeoutId) {
        clearTimeout(timer.timeoutId);
      }
      timers.delete(id);
    },
    pauseAll() {
      timers.forEach((timer) => {
        if (timer.timeoutId) {
          clearTimeout(timer.timeoutId);
          timer.timeoutId = null;

          const elapsed = Date.now() - timer.startTime;
          timer.remainingTime = Math.max(0, timer.remainingTime - elapsed);
        }
      });
    },
    resumeAll() {
      timers.forEach((timer, id) => {
        if (timer.timeoutId === null) {
          if (timer.remainingTime > 0) {
            timer.startTime = Date.now();

            if (timer.remainingTime !== Infinity) {
              timer.timeoutId = setTimeout(
                () => this.remove(id),
                timer.remainingTime
              );
            }
          } else {
            this.remove(id);
          }
        }
      });
    },
  };
};

// Create a singleton toast store that can be shared across the application.
// The store is attached to the global object to ensure it's shared across different modules and components.
//
// The main reason behind this is Astro's island architecture, where different parts of the UI can be rendered and hydrated independently,
// leading to multiple instances of the toast store. In other frameworks, this is not necessary but also doesn't cause any issues.
const STORE_KEY = '__significa_toast_store__';
const toastStore: ToastStore =
  ((globalThis as Record<string, unknown>)[STORE_KEY] as ToastStore) ??
  (() => {
    const store = createToastStore();
    (globalThis as Record<string, unknown>)[STORE_KEY] = store;
    return store;
  })();

// Hook to use the toast store
const useToastStore = () => {
  return useSyncExternalStore(
    toastStore.subscribe,
    () => toastStore.toasts,
    () => toastStore.toasts
  );
};

const toast = (toast: Omit<Toast, 'id'>) => {
  toastStore.add(toast);
};

const Toaster = ({ className }: { className?: string }) => {
  const toasts = useToastStore();
  const ref = useTopLayer<HTMLDivElement>(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Modals use the DOM top-layer (dialogs, drawers, etc.), where stacking order is
    // determined by open order and DOM position. To appear above a modal, the toaster
    // must be the last element in the DOM and opened after the modal.
    // To ensure this, we listen to modal open events and toggle the popover state of the toaster,
    // which moves it to the end of the top-layer and top of the stacking context.
    const onModalOpen = () => {
      element?.togglePopover();
      setTimeout(() => element?.togglePopover(), 0);
    };

    window.addEventListener('ui:modal-open', onModalOpen);

    return () => {
      window.removeEventListener('ui:modal-open', onModalOpen);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      data-toaster-provider
      className={cn(
        'fixed flex size-full flex-col items-end justify-end overflow-hidden bg-transparent px-4 py-3',
        'pointer-events-none',
        className
      )}
    >
      <AnimatePresence>
        {toasts.map((toast, index) => {
          return (
            <motion.div
              key={toast.id}
              onMouseEnter={() => toastStore.pauseAll()}
              onMouseLeave={() => toastStore.resumeAll()}
              style={{ zIndex: toasts.length - index }}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              className="pointer-events-auto box-border *:my-1.5"
            >
              <ToasterItem
                toast={toast}
                onDismiss={() => toastStore.remove(toast.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

type ToasterItemProps = {
  toast: Toast;
  onDismiss: () => void;
};

const ToasterItem = ({ toast, onDismiss }: ToasterItemProps) => {
  const { title, description, variant = 'default' } = toast;

  const Icon = {
    default: null,
    positive: CheckCircleIcon,
    negative: XCircleIcon,
  }[variant];

  return (
    <motion.div
      className={cn(
        'relative flex max-w-88 items-center gap-2 rounded-lg border p-3 pl-4 shadow-lg',
        variant === 'default' && 'border-border bg-background',
        variant === 'positive' && 'border-green-200 bg-green-50 text-green-900',
        variant === 'negative' && 'border-red-200 bg-red-50 text-red-900'
      )}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: '-100%' }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
    >
      {Icon && <Icon weight="fill" className="size-5" />}
      <div className={cn('pr-6 text-sm')}>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-0.5 text-pretty text-xs opacity-70">{description}</p>
        )}
      </div>
      <ToastCloseButton onClick={onDismiss} />
    </motion.div>
  );
};

const ToastCloseButton = ({
  onClick,
}: Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'>) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dismiss notification"
      className={cn(
        'relative mb-auto flex size-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border-inherit bg-inherit',
        'ring-ring focus-visible:outline-none focus-visible:ring-4',
        'after:absolute after:inset-0 after:bg-[currentColor] after:opacity-0 hover:after:opacity-4 active:after:opacity-8'
      )}
    >
      <XIcon className="size-3 opacity-50" />
    </button>
  );
};

export { Toaster, toast };
