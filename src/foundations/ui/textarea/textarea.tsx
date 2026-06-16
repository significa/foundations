import type { VariantProps } from 'cva';

import { inputStyle } from '@/foundations/ui/input/input';
import { cn } from '@/lib/utils/classnames';

interface TextareaProps extends React.ComponentPropsWithRef<'textarea'> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>['variant'];
}

const Textarea = ({ className, invalid, variant, ...props }: TextareaProps) => {
  return (
    <textarea
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        'h-auto resize-none py-2 leading-snug',
        className
      )}
      {...props}
    />
  );
};

export { Textarea };
