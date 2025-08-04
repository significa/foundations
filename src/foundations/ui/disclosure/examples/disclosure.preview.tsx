import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "../disclosure";

export default function DisclosurePreview() {
  return (
    <div className="w-90 text-sm">
      <Disclosure>
        <DisclosureTrigger>
          Did you know that octopuses have three hearts?
        </DisclosureTrigger>
        <DisclosureContent className="text-muted-foreground">
          Two hearts pump blood to the gills, while the third one circulates it
          to the rest of the body. When they swim, their third heart actually
          stops beating - which is why they tend to crawl more than swim!
        </DisclosureContent>
      </Disclosure>
      <Disclosure>
        <DisclosureTrigger>
          Want to hear about immortal jellyfish?
        </DisclosureTrigger>
        <DisclosureContent className="text-muted-foreground">
          The Turritopsis dohrnii jellyfish can technically live forever! When
          stressed, it can transform back into a juvenile form by turning its
          existing cells into different cell types. It&apos;s like having a
          reset button for aging!
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
