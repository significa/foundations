import { Spinner } from '@/foundations/ui/spinner/spinner';

const variants = ['ring', 'dots', 'bars', 'frames'] as const;

export default function SpinnerVariantsPreview() {
  return (
    <div className="grid grid-cols-2 items-center gap-x-12 gap-y-8 sm:grid-cols-4">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-4">
          <div className="flex size-6 items-center justify-center">
            <Spinner variant={variant} />
          </div>
          <span className="text-center text-foreground-secondary text-xs">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}
