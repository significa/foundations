import { Disclosure } from "@/foundations/ui/disclosure/disclosure";

export default function DisclosureNestedPreview() {
  return (
    <div className="w-72 text-sm">
      <Disclosure.Group>
        <Disclosure>
          <Disclosure.Trigger>
            Solar System
            <Disclosure.Chevron />
          </Disclosure.Trigger>
          <Disclosure.Content>
            <Disclosure.Group>
              <Disclosure>
                <Disclosure.Trigger className="pl-4 text-foreground-secondary">
                  Inner Planets
                  <Disclosure.Chevron />
                </Disclosure.Trigger>
                <Disclosure.Content className="pl-8 text-foreground-secondary">
                  Mercury, Venus, Earth, and Mars — rocky worlds close to the Sun, shaped by heat
                  and geological activity.
                </Disclosure.Content>
              </Disclosure>
              <Disclosure>
                <Disclosure.Trigger className="pl-4 text-foreground-secondary">
                  Outer Planets
                  <Disclosure.Chevron />
                </Disclosure.Trigger>
                <Disclosure.Content className="pl-8 text-foreground-secondary">
                  Jupiter, Saturn, Uranus, and Neptune — gas and ice giants with rings, storms, and
                  dozens of moons each.
                </Disclosure.Content>
              </Disclosure>
            </Disclosure.Group>
          </Disclosure.Content>
        </Disclosure>
        <Disclosure>
          <Disclosure.Trigger>
            Deep Ocean
            <Disclosure.Chevron />
          </Disclosure.Trigger>
          <Disclosure.Content>
            <Disclosure.Group>
              <Disclosure>
                <Disclosure.Trigger className="pl-4 text-foreground-secondary">
                  Sunlight Zone
                  <Disclosure.Chevron />
                </Disclosure.Trigger>
                <Disclosure.Content className="pl-8 text-foreground-secondary">
                  The top 200 meters where light penetrates, supporting coral reefs, fish, and most
                  visible marine life.
                </Disclosure.Content>
              </Disclosure>
              <Disclosure>
                <Disclosure.Trigger className="pl-4 text-foreground-secondary">
                  Midnight Zone
                  <Disclosure.Chevron />
                </Disclosure.Trigger>
                <Disclosure.Content className="pl-8 text-foreground-secondary">
                  Below 1,000 meters, no sunlight reaches here. Creatures survive through
                  bioluminescence and slow metabolisms.
                </Disclosure.Content>
              </Disclosure>
            </Disclosure.Group>
          </Disclosure.Content>
        </Disclosure>
      </Disclosure.Group>
    </div>
  );
}
