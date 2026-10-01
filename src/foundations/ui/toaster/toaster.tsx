import { CheckCircleIcon, XCircleIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useElementTransition } from "@/foundations/hooks/use-element-transition/use-element-transition";
import { useTopLayer } from "@/foundations/hooks/use-top-layer/use-top-layer";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils/classnames";

const DEFAULT_TOAST_DURATION_MS = 7000;

// `loading` shows a spinner and stays until it's updated or dismissed
type ToastVariant = "default" | "positive" | "negative" | "loading";

type Toast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
};

// `leaving` is internal, so it stays out of the `toast()` input
type ToastEntry = Toast & { leaving?: boolean };

// pass an `id` to replace the toast showing under it, in place, instead of stacking a new one
type ToastInput = Omit<Toast, "id"> & { id?: string };

type ToastStore = {
  toasts: ToastEntry[];
  subscribe: (listener: () => void) => () => void;
  add: (config: ToastInput) => string;
  update: (id: string, config: Partial<Omit<Toast, "id">>) => void;
  remove: (id: string) => void;
  unmount: (id: string) => void;
  pauseAll: () => void;
  resumeAll: () => void;
};

const getDuration = ({ duration, variant }: Pick<Toast, "duration" | "variant">) =>
  duration ?? (variant === "loading" ? Infinity : DEFAULT_TOAST_DURATION_MS);

const createToastStore = (): ToastStore => {
  let toasts: ToastEntry[] = [];
  let paused = false;
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

  const clearTimer = (id: string) => {
    const timer = timers.get(id);
    if (timer?.timeoutId) {
      clearTimeout(timer.timeoutId);
    }
    timers.delete(id);
  };

  // (re)starts a toast's dismiss timer; while hovered it waits for `resumeAll`
  const startTimer = (id: string, duration: number) => {
    clearTimer(id);
    const timeout =
      !paused && duration !== Infinity ? setTimeout(() => store.remove(id), duration) : null;

    timers.set(id, {
      startTime: Date.now(),
      remainingTime: duration,
      timeoutId: timeout,
    });
  };

  const store: ToastStore = {
    get toasts() {
      return toasts;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add({ id: requestedId, ...toastData }) {
      const id = requestedId ?? getToastId();
      const newToast = { ...toastData, id };

      // same id: takes the old toast's place (even one on its way out) instead of stacking
      toasts = toasts.some((toast) => toast.id === id)
        ? toasts.map((toast) => (toast.id === id ? newToast : toast))
        : [...toasts, newToast];
      notifyListeners();
      startTimer(id, getDuration(newToast));

      return id;
    },
    update(id, toastData) {
      const current = toasts.find((toast) => toast.id === id);
      if (!current || current.leaving) return;

      const next = { ...current, ...toastData };
      toasts = toasts.map((toast) => (toast.id === id ? next : toast));
      notifyListeners();
      startTimer(id, getDuration(next));
    },
    // kept in the list until its exit transition ends, then `unmount` drops it
    remove(id) {
      toasts = toasts.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast));
      notifyListeners();
      clearTimer(id);
    },
    unmount(id) {
      toasts = toasts.filter((toast) => toast.id !== id);
      notifyListeners();
    },
    pauseAll() {
      paused = true;
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
      paused = false;
      timers.forEach((timer, id) => {
        if (timer.timeoutId === null) {
          if (timer.remainingTime > 0) {
            timer.startTime = Date.now();

            if (timer.remainingTime !== Infinity) {
              timer.timeoutId = setTimeout(() => store.remove(id), timer.remainingTime);
            }
          } else {
            store.remove(id);
          }
        }
      });
    },
  };

  return store;
};

// Create a singleton toast store that can be shared across the application.
// The store is attached to the global object to ensure it's shared across different modules and components.
//
// The main reason behind this is Astro's island architecture, where different parts of the UI can be rendered and hydrated independently,
// leading to multiple instances of the toast store. In other frameworks, this is not necessary but also doesn't cause any issues.
const STORE_KEY = "__significa_toast_store__";
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
    () => toastStore.toasts,
  );
};

type ToastContent = Omit<ToastInput, "id" | "variant">;
type ToastSettled<T> = ToastContent | ((value: T) => ToastContent);

// Shows a toast and returns its id, for `toast.update` and `toast.dismiss`
const toast = Object.assign((config: ToastInput) => toastStore.add(config), {
  update: (id: string, config: Partial<Omit<Toast, "id">>) => toastStore.update(id, config),
  dismiss: (id: string) => toastStore.remove(id),
  // One toast for an async task: `loading` while it runs, then the same toast turns `positive`
  // or `negative` in place. Returns the promise, so callers can still await or catch it.
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: ToastContent; success: ToastSettled<T>; error: ToastSettled<unknown> },
  ): Promise<T> => {
    const id = toastStore.add({ ...messages.loading, variant: "loading" });

    const settle = <V,>(variant: ToastVariant, content: ToastSettled<V>, value: V) => {
      const next = typeof content === "function" ? content(value) : content;
      // a description or duration the settled toast doesn't set must not carry over
      toastStore.update(id, { description: undefined, duration: undefined, ...next, variant });
    };

    promise.then(
      (value) => settle("positive", messages.success, value),
      (error: unknown) => settle("negative", messages.error, error),
    );

    return promise;
  },
});

const Toaster = ({ className }: { className?: string }) => {
  const toasts = useToastStore();
  const elementRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useTopLayer<HTMLDivElement>(true);

  useEffect(() => {
    const element = elementRef.current;
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

    window.addEventListener("ui:modal-open", onModalOpen);

    return () => {
      window.removeEventListener("ui:modal-open", onModalOpen);
    };
  }, []);

  return (
    <div
      ref={composeRefs(elementRef, topLayerRef)}
      data-toaster-provider
      className={cn(
        "fixed flex size-full flex-col items-end justify-end overflow-hidden bg-transparent px-4 py-3",
        "pointer-events-none",
        className,
      )}
    >
      {toasts.map((toast, index) => (
        <ToasterRow key={toast.id} toast={toast} zIndex={toasts.length - index} />
      ))}
    </div>
  );
};

const ToasterRow = ({ toast, zIndex }: { toast: ToastEntry; zIndex: number }) => {
  const { ref, isMounted, status } = useElementTransition<HTMLDivElement>(!toast.leaving);

  useEffect(() => {
    if (!isMounted) toastStore.unmount(toast.id);
  }, [isMounted, toast.id]);

  if (!isMounted) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover only pauses the dismiss timers
    <div
      ref={ref}
      data-status={status}
      onMouseEnter={() => toastStore.pauseAll()}
      onMouseLeave={() => toastStore.resumeAll()}
      style={{ zIndex }}
      className={cn(
        "group/toast pointer-events-auto box-border grid *:my-1.5",
        // minmax(0, …) so the row can collapse past the toast's padding and margins
        "grid-rows-[minmax(0,1fr)] starting:grid-rows-[minmax(0,0fr)] data-[status=closed]:grid-rows-[minmax(0,0fr)]",
        "transition-[grid-template-rows] duration-500 ease-spring",
      )}
    >
      <ToasterItem toast={toast} onDismiss={() => toastStore.remove(toast.id)} />
    </div>
  );
};

type ToasterItemProps = {
  toast: Toast;
  onDismiss: () => void;
};

// The card's size follows its content, so a toast that changes (`update`, `promise`) grows or
// shrinks into its new size instead of snapping. Undefined until first measured: the card enters
// at its natural size.
const useContentSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize[0];
      if (box) setSize({ width: box.inlineSize, height: box.blockSize });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

const ToasterItem = ({ toast, onDismiss }: ToasterItemProps) => {
  const { title, description, variant = "default" } = toast;
  const { ref, size } = useContentSize();

  const Icon = {
    default: null,
    positive: CheckCircleIcon,
    negative: XCircleIcon,
    loading: null,
  }[variant];

  // a swapped icon or text comes in on its own, keyed so it remounts and runs `starting:`
  const swapIn = cn(
    "transition-[opacity,scale] duration-300 ease-spring starting:opacity-0",
    "motion-safe:starting:scale-50",
  );

  return (
    <div
      style={size}
      className={cn(
        // `box-content`: the measured size is the content's, the border sits outside it
        "relative box-content max-w-88 self-start overflow-hidden rounded-lg border shadow-lg",
        "transition-[opacity,scale,translate,background-color,border-color,color] duration-500 ease-spring",
        "motion-safe:transition-[opacity,scale,translate,background-color,border-color,color,width,height]",
        "starting:opacity-0 group-data-[status=closed]/toast:opacity-0",
        "motion-safe:starting:scale-95 motion-safe:group-data-[status=closed]/toast:-translate-y-full motion-safe:group-data-[status=closed]/toast:scale-95",
        (variant === "default" || variant === "loading") && "border-border bg-background",
        variant === "positive" && "border-success/20 bg-success/10 text-success",
        variant === "negative" && "border-error/20 bg-error/10 text-error",
      )}
      role="status"
      aria-live="polite"
    >
      <div ref={ref} className="flex w-max max-w-88 items-center gap-2 p-3 pl-4">
        {(Icon || variant === "loading") && (
          <span
            key={variant}
            className={cn("flex size-5 shrink-0 items-center justify-center", swapIn)}
          >
            {Icon ? (
              <Icon weight="fill" className="size-5" />
            ) : (
              <Spinner size="lg" aria-hidden className="opacity-60" />
            )}
          </span>
        )}
        <div
          key={`${title}\n${description ?? ""}`}
          className={cn("pr-6 text-sm", swapIn, "motion-safe:starting:scale-100")}
        >
          <p className="font-medium">{title}</p>
          {description && <p className="mt-0.5 text-pretty text-xs opacity-70">{description}</p>}
        </div>
        <ToastCloseButton onClick={onDismiss} />
      </div>
    </div>
  );
};

const ToastCloseButton = ({
  onClick,
}: Omit<ComponentPropsWithoutRef<"button">, "children" | "type">) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dismiss notification"
      className={cn(
        "relative mb-auto flex size-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border-inherit bg-inherit",
        "focus-visible:ring-(length:--ring-width) ring-ring focus-visible:outline-none",
        "after:absolute after:inset-0 after:bg-current after:opacity-0 hover:after:opacity-4 active:after:opacity-8",
      )}
    >
      <XIcon className="size-3 opacity-50" />
    </button>
  );
};

export { Toaster, toast };
