import { Disclosure } from '@/foundations/ui/disclosure/disclosure';

export default function DisclosureChevronPreview() {
  return (
    <div className="w-90 text-sm">
      <Disclosure>
        <Disclosure.Trigger>
          Sloths can hold their breath for 40 minutes?
          <Disclosure.Chevron />
        </Disclosure.Trigger>
        <Disclosure.Content className="text-foreground-secondary">
          While most mammals can only hold their breath for a few minutes,
          sloths can slow their heart rates to one-third of its normal rate,
          allowing them to stay underwater for up to 40 minutes! This helps them
          escape predators and swim between islands.
        </Disclosure.Content>
      </Disclosure>
      <Disclosure>
        <Disclosure.Trigger>
          Want to learn about platypus superpowers?
          <Disclosure.Chevron />
        </Disclosure.Trigger>
        <Disclosure.Content className="text-foreground-secondary">
          Platypuses have electroreceptors in their bills that detect electrical
          signals from prey! They can sense the electrical fields produced by
          the muscular contractions of small aquatic animals. They&apos;re also
          one of the few mammals that produce venom.
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
