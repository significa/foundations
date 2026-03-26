import type { VariantProps } from 'cva';

import {
  Input,
  type inputStyle,
  useInputStyle,
} from '@/foundations/ui/input/input';
import { cn } from '@/lib/utils/classnames';

interface SelectProps extends React.ComponentPropsWithRef<'select'> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>['variant'];
}

const Select = ({ className, invalid, variant, ...props }: SelectProps) => {
  return (
    <select
      data-invalid={invalid}
      className={cn(
        useInputStyle({ variant }),
        'appearance-none bg-position-[right_--spacing(2)_center] bg-size-[1em] bg-no-repeat pr-10',
        'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJibGFjayIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        'dark:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTMuNyA1LjNsNC4zIDQuMyA0LjMtNC4zLjcuNy01IDUtNS01eiIvPjwvc3ZnPg==")]',
        className
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
