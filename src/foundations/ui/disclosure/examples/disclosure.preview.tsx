import { Disclosure } from '@/foundations/ui/disclosure/disclosure';

export default function DisclosurePreview() {
  return (
    <div className="w-90 text-sm">
      <Disclosure>
        <Disclosure.Trigger>
          Did you know that octopuses have three hearts?
        </Disclosure.Trigger>
        <Disclosure.Content className="text-foreground-secondary">
          Two hearts pump blood to the gills, while the third one circulates it
          to the rest of the body. When they swim, their third heart actually
          stops beating - which is why they tend to crawl more than swim!
        </Disclosure.Content>
      </Disclosure>
      <Disclosure>
        <Disclosure.Trigger>
          Want to hear about immortal jellyfish?
        </Disclosure.Trigger>
        <Disclosure.Content className="text-foreground-secondary">
          The Turritopsis dohrnii jellyfish can technically live forever! When
          stressed, it can transform back into a juvenile form by turning its
          existing cells into different cell types. It&apos;s like having a
          reset button for aging!
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
