"use client";

import {
  useState,
  createContext,
  use,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  Children,
  isValidElement,
  useImperativeHandle,
} from "react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useInteractions,
  UseInteractionsReturn,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { CheckIcon, CaretUpDownIcon } from "@phosphor-icons/react";
import { VariantProps } from "cva";

import { cn } from "@/lib/utils";
import { Divider } from "@/foundations/ui/divider/divider";
import { inputStyle } from "@/foundations/ui/input/input";
import {
  PopoverEmpty,
  PopoverSearchInput,
} from "@/foundations/ui/popover/popover";
import { useTopLayer } from "@/foundations/hooks/use-top-layer/use-top-layer";

// Utils

const hasChildren = (
  props: unknown
): props is { children: React.ReactNode } => {
  return typeof props === "object" && props !== null && "children" in props;
};

export function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return children.toString();
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (isValidElement(children) && hasChildren(children.props))
    return getTextContent(children.props.children);
  return "";
}

// Context

type Option<T = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

interface ListboxContextType<T = string>
  extends UseFloatingReturn,
    UseInteractionsReturn {
  elementsRef: React.RefObject<(HTMLElement | null)[]>;
  labelsRef: React.RefObject<string[]>;
  setOptions: (options: Option<T>[]) => void;
  highlightedIndex: number | null;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  value: T | undefined;
  handleSelect: (index: number | null) => void;
  invalid?: boolean;
  disabled?: boolean;
  setIsSearchable: React.Dispatch<React.SetStateAction<boolean>>;
  getIsSelected: (a: T, b: T) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListboxContext = createContext<ListboxContextType<any> | null>(null);

const useListboxContext = <T,>() => {
  const context = use(
    ListboxContext as React.Context<ListboxContextType<T> | null>
  );

  if (context == null) {
    throw new Error("useListboxContext must be used within a Listbox");
  }

  return context;
};

// Utils

const isObjectWithId = (value: unknown): value is { id: unknown } => {
  return typeof value === "object" && value !== null && "id" in value;
};

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return typeof value !== "object" && value !== null;
};

const defaultGetIsSelected = <T,>(a: T, b: T) => {
  if (isObjectWithId(a) && isObjectWithId(b)) {
    return a.id === b.id;
  }

  if (isPrimitive(a) && isPrimitive(b)) {
    return a === b;
  }

  return JSON.stringify(a) === JSON.stringify(b);
};

// Chore mechanics (Floating UI)

interface UseListboxFloatingOptions<T = string> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  invalid?: boolean;
  placement?: Placement;
  getIsSelected?: (a: T, b: T) => boolean;
  matchReferenceWidth?: boolean;
}

const useListboxFloating = <T,>({
  value,
  onChange,
  disabled,
  invalid,
  placement = "bottom",
  getIsSelected = defaultGetIsSelected,
  matchReferenceWidth = true,
}: UseListboxFloatingOptions<T>) => {
  const [open, setOpen] = useState(false);

  const [isSearchable, setIsSearchable] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [options, setOptions] = useState<Option<T>[]>([]);

  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const selectedIndex = useMemo(() => {
    if (!value) return -1;

    return options.findIndex((option) => {
      return getIsSelected(option.value, value);
    });
  }, [options, value, getIsSelected]);

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      flip({ padding: 4 }),
      shift({ padding: 4 }),
      offset(4),
      size({
        apply({ rects, elements, availableHeight }) {
          elements.floating.style.setProperty(
            "--max-height",
            `${availableHeight}px`
          );

          if (matchReferenceWidth) {
            elements.floating.style.setProperty(
              "--width",
              `${rects.reference.width}px`
            );
          }
        },
        padding: 4,
      }),
    ],
  });

  const handleSelect = useCallback(
    (index: number | null) => {
      if (index === null || !options[index]) return;

      // assuming that a `value` array means a multiselect (sorry tuples)
      const isMultiple = Array.isArray(value);

      if (isMultiple) {
        const isSelected = value.some((v) =>
          getIsSelected(options[index].value, v)
        );

        return isSelected
          ? onChange(
              value.filter((v) => !getIsSelected(options[index].value, v)) as T
            )
          : onChange([...value, options[index].value] as T);
      }

      onChange(options[index].value);
      setOpen(false);
    },
    [onChange, options, value, getIsSelected]
  );

  const listNav = useListNavigation(floating.context, {
    listRef: elementsRef,
    activeIndex: highlightedIndex,
    selectedIndex,
    onNavigate: setHighlightedIndex,
    virtual: isSearchable || undefined,
    loop: isSearchable || undefined,
  });

  const handleTypeaheadMatch = useCallback(
    (index: number | null) => {
      if (open) {
        setHighlightedIndex(index);
      } else {
        handleSelect(index);
      }
    },
    [open, handleSelect]
  );

  const labelsRef = useRef<string[]>([]);

  useEffect(() => {
    labelsRef.current = options.map((option) => option.label);
  }, [options]);

  const typeahead = useTypeahead(floating.context, {
    enabled: !(isSearchable && open),
    listRef: labelsRef,
    activeIndex: highlightedIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  });

  const click = useClick(floating.context, {
    enabled: !disabled,
    event: "mousedown",
  });
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: "listbox" });

  const interactions = useInteractions([
    listNav,
    typeahead,
    click,
    dismiss,
    role,
  ]);

  return useMemo(
    () => ({
      elementsRef,
      labelsRef,
      highlightedIndex,
      setHighlightedIndex,
      value,
      invalid,
      disabled,
      setOptions,
      handleSelect,
      setIsSearchable,
      getIsSelected,
      ...interactions,
      ...floating,
    }),
    [
      highlightedIndex,
      value,
      invalid,
      disabled,
      setOptions,
      handleSelect,
      getIsSelected,
      interactions,
      floating,
    ]
  );
};

// Components

type ListboxProps<T = string> = UseListboxFloatingOptions<T> & {
  children: React.ReactNode;
};

/**
 * Listbox is a controlled component used for choosing a value from a list of options, typically in forms.
 * It's best suited for scenarios where users need to pick an item from a predefined set.
 *
 * Use Listbox when choosing a value from a list of options.
 * Use Dropdown instead when you want to trigger actions or navigation.
 */
const Listbox = <T,>({
  children,
  ref,
  ...props
}: ListboxProps<T> & { ref?: React.Ref<ListboxContextType<T>> }) => {
  const contextValue = useListboxFloating(props);

  useImperativeHandle(ref, () => contextValue);

  return <ListboxContext value={contextValue}>{children}</ListboxContext>;
};

interface ListboxTriggerProps extends React.ComponentPropsWithRef<"button"> {
  variant?: VariantProps<typeof inputStyle>["variant"];
  placeholder?: string;
}

const ListboxTrigger = ({
  ref: refProp,
  children,
  className,
  variant,
  placeholder,
  ...props
}: ListboxTriggerProps) => {
  const ctx = useListboxContext();

  const ref = useMergeRefs([ctx.refs.setReference, refProp]);

  return (
    <ListboxButton
      ref={ref}
      placeholder={placeholder}
      variant={variant}
      className={className}
      disabled={ctx.disabled}
      data-state={ctx.context.open ? "open" : "closed"}
      data-invalid={ctx.invalid}
      {...ctx.getReferenceProps(props)}
    >
      {children}
    </ListboxButton>
  );
};

interface ListboxButtonProps extends React.ComponentPropsWithRef<"button"> {
  placeholder?: string;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

/**
 * ListboxButton is a button that mimics a select input style.
 */
const ListboxButton = ({
  ref,
  children,
  placeholder,
  variant,
  className,
  ...props
}: ListboxButtonProps) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        inputStyle({ variant }),
        "flex items-center gap-1.5 enabled:cursor-pointer",
        "relative w-full pr-10 pl-4",
        className
      )}
      {...props}
    >
      <span className="flex flex-1 items-center gap-1.5 truncate text-left">
        {children ?? (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </span>
      <CaretUpDownIcon
        weight="bold"
        className="text-foreground/80 absolute top-1/2 right-3 -translate-y-1/2 text-base"
      />
    </button>
  );
};

const hasOptionProps = (
  props: unknown
): props is {
  value: unknown;
  disabled?: boolean;
  children?: React.ReactNode;
} => {
  return typeof props === "object" && props !== null && "value" in props;
};

const ListboxOptions = <T,>({
  ref: refProp,
  children,
  className,
  style,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    setOptions,
    setIsSearchable,
    refs,
    elementsRef,
    labelsRef,
    context,
    floatingStyles,
    getFloatingProps,
  } = useListboxContext();

  const topLayerRef = useTopLayer<HTMLDivElement>(context.open);

  useEffect(() => {
    const extractOptions = (children: React.ReactNode): Option<T>[] => {
      return Children.toArray(children).reduce<Option<T>[]>((acc, child) => {
        if (isValidElement(child)) {
          if (child.type === ListboxOption && hasOptionProps(child.props)) {
            acc.push({
              value: child.props.value as T,
              label: getTextContent(child.props.children),
              disabled: child.props.disabled,
            });
          } else if (hasChildren(child.props)) {
            // Recursively extract options from nested children
            acc.push(...extractOptions(child.props.children));
          }
        }
        return acc;
      }, []);
    };

    setOptions(extractOptions(children));
  }, [children, setOptions]);

  useEffect(() => {
    const hasSearchInput = Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === ListboxSearchInput
    );

    if (hasSearchInput) {
      setIsSearchable(true);
    }
  }, [children, setIsSearchable]);

  const ref = useMergeRefs([refs.setFloating, refProp, topLayerRef]);

  if (!context.open) return null;

  return (
    <FloatingFocusManager context={context}>
      <div
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        className={cn(
          "border-border bg-background text-foreground z-50 flex flex-col items-stretch rounded-xl border p-0 shadow-xl focus:outline-none",
          "overflow-y-auto overscroll-contain",
          "max-h-(--max-height) w-(--width)",
          className
        )}
        style={{
          ...floatingStyles,
          ...style,
        }}
        {...getFloatingProps({
          ...props,
        })}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {children}
        </FloatingList>
      </div>
    </FloatingFocusManager>
  );
};

interface ListboxOptionProps<T = string>
  extends Omit<React.ComponentPropsWithRef<"button">, "children" | "value"> {
  children: React.ReactNode;
  value: T;
  disabled?: boolean;
}

const ListboxOption = <T,>({
  ref: refProp,
  value,
  children,
  disabled,
  className,
  ...props
}: ListboxOptionProps<T>) => {
  const {
    highlightedIndex,
    value: contextValue,
    getIsSelected,
    getItemProps,
    handleSelect,
  } = useListboxContext<T>();

  const label = getTextContent(children);

  const { ref: listItemRef, index } = useListItem({ label });

  const ref = useMergeRefs([listItemRef, refProp]);

  const isHighlighted = highlightedIndex === index;
  const isSelected = Array.isArray(contextValue)
    ? contextValue.some((v) => getIsSelected(v, value))
    : contextValue && getIsSelected(contextValue, value);

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isHighlighted && isSelected}
      data-selected={isSelected || undefined}
      data-highlighted={isHighlighted || undefined}
      tabIndex={isHighlighted ? 0 : -1}
      disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "data-highlighted:bg-foreground/5 text-foreground relative mx-1 flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-left font-medium outline-none select-none first-of-type:mt-1 last-of-type:mb-1 data-disabled:pointer-events-none data-disabled:opacity-50",
        "pr-8",
        className
      )}
      {...getItemProps({
        ...props,
        onClick: (e) => {
          handleSelect(index);
          props.onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        },
      })}
    >
      {children}
      {isSelected && (
        <CheckIcon
          weight="bold"
          className="text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
        />
      )}
    </button>
  );
};

const ListboxDivider = ({
  className,
  ...props
}: Omit<React.ComponentPropsWithRef<"div">, "children">) => {
  return <Divider className={cn("my-1", className)} {...props} />;
};

/**
 * SelectSearchInput is meant to render a search input within the select popover options.
 * Use it to filter the options based on a search query.
 *
 * If this component is used, the `selection` placement will be ignored.
 */
const ListboxSearchInput = ({
  ref,
  onKeyDown,
  onChange,
  ...props
}: React.ComponentPropsWithRef<"input">) => {
  const { highlightedIndex, setHighlightedIndex, handleSelect } =
    useListboxContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);

    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(highlightedIndex);
    }

    onKeyDown?.(event);
  };

  return (
    <PopoverSearchInput
      ref={ref}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...props}
    />
  );
};

const ListboxEmpty = PopoverEmpty;

export {
  Listbox,
  ListboxTrigger,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  ListboxDivider,
  ListboxSearchInput,
  ListboxEmpty,
};
