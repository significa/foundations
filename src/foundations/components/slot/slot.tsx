import { cn } from "@/lib/utils";
import { Children, cloneElement, isValidElement } from "react";

const isValidSlottableElement = (
  value: unknown
): value is React.ReactElement<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> => {
  return (
    isValidElement(value) &&
    !!value.props &&
    typeof value.props === "object" &&
    "key" in value
  );
};

export const Slot = ({
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<React.ElementType>) => {
  const element = Children.only(children);

  if (isValidSlottableElement(element)) {
    return cloneElement(element, {
      ...props,
      ...element.props,
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
export const Slottable = ({
  asChild,
  child,
  children,
  ...props
}: SlottableProps) => {
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
