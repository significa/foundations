import type { VariantProps } from "cva";

import {
  Input,
  type inputStyle,
  useInputGroupContext,
  useInputStyle,
} from "#/foundations/ui/input/input.tsx";
import { cn, cva } from "#/lib/utils/classnames.ts";

interface SelectProps extends Omit<React.ComponentPropsWithRef<"select">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
  size?: VariantProps<typeof inputStyle>["size"];
}

// The chevron is two diagonal strokes in currentColor, so it follows the text colour.
const selectChevronStyle = cva({
  base: [
    "bg-no-repeat",
    "bg-[image:linear-gradient(45deg,transparent_calc(50%-0.75px),currentColor_calc(50%-0.75px),currentColor_calc(50%+0.75px),transparent_calc(50%+0.75px)),linear-gradient(135deg,transparent_calc(50%-0.75px),currentColor_calc(50%-0.75px),currentColor_calc(50%+0.75px),transparent_calc(50%+0.75px))]",
  ],
  variants: {
    size: {
      xs: "bg-size-[4px_4px] bg-position-[calc(100%-12px)_center,calc(100%-8px)_center] pe-6 rtl:bg-position-[8px_center,12px_center]",
      sm: "bg-size-[4px_4px] bg-position-[calc(100%-16px)_center,calc(100%-12px)_center] pe-8 rtl:bg-position-[12px_center,16px_center]",
      md: "bg-size-[5px_5px] bg-position-[calc(100%-21px)_center,calc(100%-16px)_center] pe-10 rtl:bg-position-[16px_center,21px_center]",
      lg: "bg-size-[6px_6px] bg-position-[calc(100%-26px)_center,calc(100%-20px)_center] pe-12 rtl:bg-position-[20px_center,26px_center]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const Select = ({ className, invalid, variant, size, ...props }: SelectProps) => {
  // In a group the group's size wins, as it does for the input styles.
  const chevronSize = useInputGroupContext()?.size ?? size;
  return (
    <select
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        useInputStyle({ variant, size }),
        // Forced colours drop gradient images: keep the native indicator there.
        "appearance-none forced-colors:appearance-auto",
        !props.multiple && selectChevronStyle({ size: chevronSize }),
        className,
      )}
      {...props}
    />
  );
};

const SelectGroup = Input.Group;

const SelectAddon = Input.Addon;

const CompoundSelect = Object.assign(Select, {
  Group: SelectGroup,
  Addon: SelectAddon,
});

export { CompoundSelect as Select };
