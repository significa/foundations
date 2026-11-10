import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import type { VariantProps } from "cva";

import { Input, type inputStyle, useInputStyle } from "#/foundations/ui/input/input.tsx";
import { cn } from "#/lib/utils/classnames.ts";

interface SelectProps extends Omit<React.ComponentPropsWithRef<"select">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
  size?: VariantProps<typeof inputStyle>["size"];
}

// className sizes the wrapper, so the chevron moves with the select.
const Select = ({ className, invalid, variant, size, ...props }: SelectProps) => {
  return (
    <span
      className={cn(
        "relative flex w-full min-w-0 items-center self-stretch",
        // The chevron is sized in em; in a group it inherits the group's text size.
        size && (size === "xs" || size === "sm" ? "text-sm" : "text-base"),
        className,
      )}
    >
      <select
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          useInputStyle({ variant, size }),
          "peer min-w-0 appearance-none",
          !props.multiple && "pe-10",
        )}
        {...props}
      />
      {!props.multiple && (
        <CaretDownIcon
          aria-hidden="true"
          // In a group the frame already dims a disabled select.
          className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 not-in-data-ui-input-group:peer-disabled:opacity-50"
        />
      )}
    </span>
  );
};

const SelectGroup = Input.Group;

const SelectAddon = Input.Addon;

const CompoundSelect = Object.assign(Select, {
  Group: SelectGroup,
  Addon: SelectAddon,
});

export { CompoundSelect as Select };
