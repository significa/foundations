import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "../disclosure";

export default function DisclosureChevronPreview() {
  return (
    <div className="w-90 text-sm">
      <Disclosure>
        <DisclosureTrigger>
          Sloths can hold their breath for 40 minutes?
          <DisclosureChevron />
        </DisclosureTrigger>
        <DisclosureContent className="text-muted-foreground">
          While most mammals can only hold their breath for a few minutes,
          sloths can slow their heart rates to one-third of its normal rate,
          allowing them to stay underwater for up to 40 minutes! This helps them
          escape predators and swim between islands.
        </DisclosureContent>
      </Disclosure>
      <Disclosure>
        <DisclosureTrigger>
          Want to learn about platypus superpowers?
          <DisclosureChevron />
        </DisclosureTrigger>
        <DisclosureContent className="text-muted-foreground">
          Platypuses have electroreceptors in their bills that detect electrical
          signals from prey! They can sense the electrical fields produced by
          the muscular contractions of small aquatic animals. They&apos;re also
          one of the few mammals that produce venom.
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
