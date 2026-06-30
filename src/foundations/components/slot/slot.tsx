import { Children, cloneElement, isValidElement } from "react";

import { cn } from "@/lib/utils/classnames";

const isValidSlottableElement = (
  value: unknown,
): value is React.ReactElement<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> => {
  return (
    isValidElement(value) && !!value.props && typeof value.props === "object" && "key" in value
  );
};

export const Slot = ({
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<React.ElementType>) => {
  const element = Children.only(children);

  if (isValidSlottableElement(element)) {
    // A native <button> defaults to type="submit", which submits the enclosing
    // form. Default it to "button" when the rendered element is a native button
    // and neither the child nor the parent passed an explicit type. Injected
    // after the spreads so an explicit type always wins; skipped entirely for
    // non-button children (e.g. <a>) so we never leak a `type` attribute.
    const typeDefault =
      element.type === "button" &&
      (element.props as { type?: unknown }).type === undefined &&
      (props as { type?: unknown }).type === undefined
        ? { type: "button" as const }
        : {};

    return cloneElement(element, {
      ...props,
      ...element.props,
      ...typeDefault,
      ref,
      style: {
        ...props.style,
        ...element.props.style,
      },
      className: cn(element.props.className, props.className),
    });
  }

  throw new Error("Slot needs a valid react element child");
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
 * see https://github.com/radix-ui/primitives/issues/1825
 */
export const Slottable = ({ asChild, child, children, ...props }: SlottableProps) => {
  return (
    <>
      {asChild
        ? isValidSlottableElement(child)
          ? cloneElement(child, props, children(child.props.children))
          : null
        : children(child)}
    </>
  );
};
