import { Children, cloneElement, isValidElement, useMemo } from "react";

import { composeRefs } from "#/foundations/utils/compose-refs/compose-refs.ts";
import { cn } from "#/lib/utils/classnames.ts";

type SlottableElementProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: unknown;
  ref?: React.Ref<unknown>;
  [prop: string]: unknown;
};

const isValidSlottableElement = (
  value: unknown,
): value is React.ReactElement<SlottableElementProps> => {
  return (
    isValidElement(value) && !!value.props && typeof value.props === "object" && "key" in value
  );
};

// Events a slot handler vetoed with `skipChildHandler`. Explicit, unlike checking
// `defaultPrevented`, which an ancestor or nested element may already have set.
const skippedEvents = new WeakSet<object>();

/** Call from a slot's `on*` handler to stop the child's handler of the same name for this event. */
export const skipChildHandler = (event: object) => {
  skippedEvents.add(event);
};

const isObject = (value: unknown): value is object => {
  return typeof value === "object" && value !== null;
};

// Where both pass the same `on*` handler, the slot's runs first, then the child's unless the slot's
// called `skipChildHandler` (how a disabled or loading Button blocks an asChild link's onClick).
const composeEventHandlers = (
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) => {
  const composed: Record<string, (...args: unknown[]) => void> = {};

  for (const [name, slotHandler] of Object.entries(slotProps)) {
    const childHandler = childProps[name];
    if (!/^on[A-Z]/.test(name)) continue;
    if (typeof slotHandler !== "function" || typeof childHandler !== "function") continue;

    // Not every `on*` is a DOM event (`onOpenChange(open, event, reason)`): pass every argument on.
    composed[name] = (...args: unknown[]) => {
      const event = args[0];
      // React shares one event along the bubble path: a mark from a nested element isn't this slot's.
      if (isObject(event)) skippedEvents.delete(event);
      slotHandler(...args);
      if (isObject(event) && skippedEvents.has(event)) return;
      childHandler(...args);
    };
  }

  return composed;
};

export const Slot = ({
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<React.ElementType>) => {
  const element = Children.only(children);
  const childRef = isValidSlottableElement(element) ? element.props.ref : undefined;
  const composedRef = useMemo(() => composeRefs(ref, childRef), [ref, childRef]);

  if (!isValidSlottableElement(element)) {
    throw new Error("Slot needs a valid react element child");
  }

  // An explicit `undefined` or `null` on the child (`onClick={cond ? fn : undefined}`) is no prop:
  // dropped so it can't erase the slot's in the spread below.
  const childProps = Object.fromEntries(
    Object.entries(element.props).filter(([, value]) => value != null),
  );

  // A native <button> defaults to type="submit", which submits the enclosing
  // form. Default it to "button" when the rendered element is a native button
  // and neither the child nor the parent passed an explicit type. Injected
  // after the spreads so an explicit type always wins; skipped entirely for
  // non-button children (e.g. <a>) so we never leak a `type` attribute.
  const typeDefault =
    element.type === "button" && childProps.type === undefined && props.type === undefined
      ? { type: "button" as const }
      : {};

  return cloneElement(element, {
    ...props,
    ...childProps,
    ...typeDefault,
    ...composeEventHandlers(props, childProps),
    ref: composedRef,
    style: {
      ...props.style,
      ...element.props.style,
    },
    className: cn(element.props.className, props.className),
  });
};

Slot.displayName = "Slot";

type SlottableProps = {
  asChild: boolean;
  child: React.ReactNode;
  children: (child: React.ReactNode) => React.ReactElement;
};

/**
 * Slottable is required when you want to use a Slot but render more than one child inside (e.g.: a button with the children + a spinner icon)
 *
 * Under `asChild` the child renders through `Slot`, so the slot's props merge with the child's
 * (handlers composed, classNames and styles merged, refs composed) rather than replace them.
 *
 * see https://github.com/radix-ui/primitives/issues/1825
 */
export const Slottable = ({ asChild, child, children, ...props }: SlottableProps) => {
  if (!asChild) return children(child);
  if (!isValidSlottableElement(child)) return null;

  return <Slot {...props}>{cloneElement(child, undefined, children(child.props.children))}</Slot>;
};
