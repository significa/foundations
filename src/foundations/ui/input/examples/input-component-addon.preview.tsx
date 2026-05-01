import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

import { Input } from '@/foundations/ui/input/input';
import { Menu } from '@/foundations/ui/menu/menu';

const countries = [
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
] as const;

type Country = (typeof countries)[number];

// Phone field with a country picker as a leading addon. Demonstrates the
// asChild → asChild chain (`Input.Addon` → `Menu.Trigger` → `<button>`)
// for composing complex interactive content into the input frame. Menu
// brings keyboard nav, focus management, and proper ARIA roles for free.
export default function InputComponentAddon() {
  const [country, setCountry] = useState<Country>(countries[0]);

  return (
    <div className="w-90">
      <Menu>
        <Input.Group>
          <Input.Addon asChild>
            <Menu.Trigger asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-foreground-secondary transition-colors hover:text-foreground"
              >
                <span className="text-base tabular-nums leading-none">
                  {country.dial}
                </span>
                <CaretDownIcon className="size-3" />
              </button>
            </Menu.Trigger>
          </Input.Addon>
          <Input type="tel" placeholder="000 000 000" />
        </Input.Group>
        <Menu.Items className="w-64">
          {countries.map((c) => (
            <Menu.Item
              className="justify-between"
              key={c.code}
              onSelect={() => setCountry(c)}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
              </span>
              <span className="text-foreground-secondary text-sm">
                {c.dial}
              </span>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}
