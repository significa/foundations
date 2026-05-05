import { useMemo, useState } from 'react';
import { NumberInput } from '@/foundations/ui/number-input/number-input';

// German locale formatting: `1.234,56` instead of `1,234.56`. The same pattern
// works for any locale via `Intl.NumberFormat`.
export default function NumberInputLocaleExample() {
  const [value, setValue] = useState(1234.56);

  const { format, parse } = useMemo(() => {
    const formatter = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return {
      format: (n: number) => formatter.format(n),
      parse: (s: string) => {
        const trimmed = s.trim();
        if (trimmed === '') return Number.NaN;
        // Strip thousands separators (`.`), normalize decimal `,` to `.`.
        const normalized = trimmed.replace(/\./g, '').replace(',', '.');
        return Number(normalized);
      },
    };
  }, []);

  return (
    <div className="w-64">
      <NumberInput
        value={value}
        onValueChange={setValue}
        step={0.01}
        format={format}
        parse={parse}
      />
    </div>
  );
}
