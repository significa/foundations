import { Disclosure } from '@/foundations/ui/disclosure/disclosure';

export default function DisclosurePreview() {
  return (
    <div className="w-90 text-sm">
      <Disclosure.Group>
        <Disclosure>
          <Disclosure.Trigger>
            Did you know that honey never spoils?
          </Disclosure.Trigger>
          <Disclosure.Content className="text-foreground-secondary">
            Archaeologists have found pots of honey in ancient Egyptian tombs
            that are over 3,000 years old and still perfectly edible! The unique
            chemical composition and low moisture content make it impossible for
            bacteria to grow in honey.
          </Disclosure.Content>
        </Disclosure>
        <Disclosure>
          <Disclosure.Trigger>
            Want to learn about hummingbird metabolism?
          </Disclosure.Trigger>
          <Disclosure.Content className="text-foreground-secondary">
            A hummingbird&apos;s heart beats up to 1,260 times per minute during
            flight! They have such a fast metabolism that they need to eat every
            10-15 minutes and visit up to 2,000 flowers per day. At night, they
            enter a state called torpor where their metabolism slows down by 95%
            to survive.
          </Disclosure.Content>
        </Disclosure>
      </Disclosure.Group>
    </div>
  );
}
