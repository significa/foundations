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
  FloatingPortal,
  inner,
  offset,
  Placement,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useInnerOffset,
  useInteractions,
  UseInteractionsReturn,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { Check, CaretUpDown } from "@phosphor-icons/react";
import { VariantProps } from "cva";

import { cn } from "@/lib/utils";
import { Divider } from "@/foundations/ui/divider/divider";
import { inputStyle } from "@/foundations/ui/input/input";
import { useField } from "@/foundations/ui/field/field";
import {
  PopoverEmpty,
  PopoverSearchInput,
} from "@/foundations/ui/popover/popover";

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

interface SelectContextType<T = string>
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
const SelectContext = createContext<SelectContextType<any> | null>(null);

const useSelectContext = <T,>() => {
  const context = use(
    SelectContext as React.Context<SelectContextType<T> | null>
  );

  if (context == null) {
    throw new Error("useSelectContext must be used within a Select");
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

interface UseSelectFloatingOptions<T = string> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  invalid?: boolean;
  placement?: Placement | "selection";
  getIsSelected?: (a: T, b: T) => boolean;
  matchReferenceWidth?: boolean;
}

const useSelectFloating = <T,>({
  value,
  onChange,
  disabled,
  invalid,
  placement = "selection",
  getIsSelected = defaultGetIsSelected,
  matchReferenceWidth = true,
}: UseSelectFloatingOptions<T>) => {
  const [open, setOpen] = useState(false);

  const [isSearchable, setIsSearchable] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [options, setOptions] = useState<Option<T>[]>([]);

  const [innerOffset, setInnerOffset] = useState(0);
  const [fallback, setFallback] = useState(false);

  const overflowRef = useRef<SideObject>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const selectedIndex = useMemo(() => {
    if (!value) return -1;

    return options.findIndex((option) => {
      return getIsSelected(option.value, value);
    });
  }, [options, value, getIsSelected]);

  if (!open) {
    if (innerOffset !== 0) setInnerOffset(0);
    if (fallback) setFallback(false);
  }

  const shouldPositionOnSelection =
    placement === "selection" &&
    !isSearchable &&
    !fallback &&
    selectedIndex !== -1;

  const floating = useFloating({
    placement: placement === "selection" ? "bottom" : placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: shouldPositionOnSelection
      ? [
          inner({
            listRef: elementsRef,
            overflowRef,
            index: selectedIndex,
            offset: innerOffset,
            onFallbackChange: setFallback,
            padding: 4,
          }),
          offset({
            crossAxis: -2,
          }),
          size({
            apply({ rects, elements }) {
              Object.assign(elements.floating.style, {
                width: matchReferenceWidth
                  ? `${rects.reference.width + 2 * 2}px`
                  : undefined,
              });
            },
          }),
        ]
      : [
          flip({ padding: 4 }),
          shift({ padding: 4 }),
          offset(4),
          size({
            apply({ rects, elements, availableHeight }) {
              Object.assign(elements.floating.style, {
                maxHeight: `${availableHeight}px`,
                width: matchReferenceWidth
                  ? `${rects.reference.width}px`
                  : undefined,
              });
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
  const innerOffsetMiddleware = useInnerOffset(floating.context, {
    enabled: !fallback,
    onChange: setInnerOffset,
    overflowRef,
  });

  const interactions = useInteractions([
    listNav,
    typeahead,
    click,
    dismiss,
    role,
    innerOffsetMiddleware,
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

type SelectProps<T = string> = UseSelectFloatingOptions<T> & {
  children: React.ReactNode;
};

/**
 * Select is a controlled component used for choosing a value from a list of options, typically in forms.
 * It's best suited for scenarios where users need to pick an item from a predefined set.
 *
 * Use Select when choosing a value from a list of options.
 * Use Dropdown instead when you want to trigger actions or navigation.
 */
const Select = <T,>({
  children,
  ref,
  ...props
}: SelectProps<T> & { ref?: React.Ref<SelectContextType<T>> }) => {
  const contextValue = useSelectFloating(props);

  useImperativeHandle(ref, () => contextValue);

  return <SelectContext value={contextValue}>{children}</SelectContext>;
};

interface SelectTriggerProps extends React.ComponentPropsWithRef<"button"> {
  variant?: VariantProps<typeof inputStyle>["variant"];
  placeholder?: string;
}

const SelectTrigger = ({
  ref: refProp,
  children,
  className,
  variant,
  placeholder,
  id,
  ...props
}: SelectTriggerProps) => {
  const ctx = useSelectContext();
  const fieldCtx = useField();

  const invalid = ctx.invalid || fieldCtx?.["aria-errormessage"] || undefined;

  const ref = useMergeRefs([ctx.refs.setReference, refProp]);

  return (
    <SelectButton
      ref={ref}
      placeholder={placeholder}
      variant={variant}
      className={className}
      id={id ?? fieldCtx?.id}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      disabled={ctx.disabled}
      data-state={ctx.context.open ? "open" : "closed"}
      data-invalid={invalid}
      {...ctx.getReferenceProps(props)}
    >
      {children}
    </SelectButton>
  );
};

interface SelectButtonProps extends React.ComponentPropsWithRef<"button"> {
  placeholder?: string;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

/**
 * SelectButton is a button that mimics a select input style.
 */
const SelectButton = ({
  ref,
  children,
  placeholder,
  variant,
  className,
  ...props
}: SelectButtonProps) => {
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
          <span className="text-foreground-secondary">{placeholder}</span>
        )}
      </span>
      <CaretUpDown
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

const SelectOptions = <T,>({
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
  } = useSelectContext();

  useEffect(() => {
    const extractOptions = (children: React.ReactNode): Option<T>[] => {
      return Children.toArray(children).reduce<Option<T>[]>((acc, child) => {
        if (isValidElement(child)) {
          if (child.type === SelectOption && hasOptionProps(child.props)) {
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
      (child) => isValidElement(child) && child.type === SelectSearchInput
    );

    if (hasSearchInput) {
      setIsSearchable(true);
    }
  }, [children, setIsSearchable]);

  const ref = useMergeRefs([refs.setFloating, refProp]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context}>
        <div
          ref={ref}
          data-state={context.open ? "open" : "closed"}
          className={cn(
            "border-border bg-background text-foreground z-50 flex flex-col items-stretch rounded-xl border p-0 shadow-xl focus:outline-none",
            "overflow-y-auto overscroll-contain",
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
    </FloatingPortal>
  );
};

interface SelectOptionProps<T = string>
  extends Omit<React.ComponentPropsWithRef<"button">, "children" | "value"> {
  children: React.ReactNode;
  value: T;
  disabled?: boolean;
  withCheckmark?: boolean;
}

const SelectOption = <T,>({
  ref: refProp,
  value,
  children,
  disabled,
  className,
  withCheckmark = true,
  ...props
}: SelectOptionProps<T>) => {
  const {
    highlightedIndex,
    value: contextValue,
    getIsSelected,
    getItemProps,
    handleSelect,
  } = useSelectContext<T>();

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
        "data-highlighted:bg-background-secondary text-foreground/80 relative mx-1 flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-left text-base font-medium outline-none select-none first:mt-1 last:mb-1 data-disabled:pointer-events-none data-disabled:opacity-50",
        withCheckmark && "pr-8",
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
      {isSelected && withCheckmark && (
        <Check
          weight="bold"
          className="text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
        />
      )}
    </button>
  );
};

const SelectDivider = ({
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
const SelectSearchInput = ({
  ref,
  onKeyDown,
  onChange,
  ...props
}: React.ComponentPropsWithRef<"input">) => {
  const { highlightedIndex, setHighlightedIndex, handleSelect } =
    useSelectContext();

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

const SelectEmpty = PopoverEmpty;

export {
  Select,
  SelectTrigger,
  SelectButton,
  SelectOption,
  SelectOptions,
  SelectDivider,
  SelectSearchInput,
  SelectEmpty,
};
