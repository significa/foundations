import { cn } from "@/lib/utils";

import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
  DisclosureChevron,
  DisclosureGroup,
} from "@/foundations/ui/disclosure/disclosure";

const AccordionGroup = ({
  children,
  className,
}: React.ComponentProps<"div">) => {
  return (
    <DisclosureGroup>
      <div className={cn("rounded-lg border", className)}>{children}</div>
    </DisclosureGroup>
  );
};

const Accordion = ({
  children,
  className,
}: React.ComponentProps<typeof Disclosure>) => {
  return (
    <Disclosure className={cn("border-b last:border-b-0", className)}>
      {children}
    </Disclosure>
  );
};

const AccordionTrigger = ({
  children,
  className,
}: React.ComponentProps<typeof DisclosureTrigger>) => {
  return (
    <DisclosureTrigger
      className={cn(
        "hover:bg-foreground/5 flex cursor-pointer items-center justify-between gap-4 px-3 py-2 transition-colors",
        className
      )}
    >
      {children}
      <DisclosureChevron />
    </DisclosureTrigger>
  );
};

const AccordionContent = ({
  children,
  className,
}: React.ComponentProps<typeof DisclosureContent>) => {
  return (
    <DisclosureContent>
      <div className={cn("border-t px-3 py-2", className)}>{children}</div>
    </DisclosureContent>
  );
};

export default function DisclosureStyledPreview() {
  return (
    <AccordionGroup>
      <Accordion>
        <AccordionTrigger>
          Did you know that butterflies taste with their feet?
        </AccordionTrigger>
        <AccordionContent>
          Butterflies have taste receptors on their feet that help them identify
          which plants to lay their eggs on. When they land on a plant, they can
          taste it to determine if it&apos;s suitable food for their
          caterpillars.
        </AccordionContent>
      </Accordion>
      <Accordion>
        <AccordionTrigger>
          Want to learn about tardigrade superpowers?
        </AccordionTrigger>
        <AccordionContent>
          Tardigrades, also known as water bears, can survive in space! They can
          withstand extreme temperatures, pressure, radiation, and can even
          survive being completely dehydrated for years by entering a state of
          cryptobiosis.
        </AccordionContent>
      </Accordion>
      <Accordion>
        <AccordionTrigger>
          Have you heard about the immortal jellyfish?
        </AccordionTrigger>
        <AccordionContent>
          The Turritopsis dohrnii jellyfish can technically live forever! When
          stressed or injured, it can transform back into its juvenile stage
          instead of dying, making it the only known animal capable of
          biological immortality.
        </AccordionContent>
      </Accordion>
    </AccordionGroup>
  );
}
