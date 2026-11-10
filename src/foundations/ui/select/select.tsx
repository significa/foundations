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
    <span className={cn("relative flex w-full min-w-0 items-center self-stretch", className)}>
      <select
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        className={cn(useInputStyle({ variant, size }), "peer appearance-none pr-10")}
        {...props}
      />
      <CaretDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 peer-disabled:opacity-50"
      />
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
