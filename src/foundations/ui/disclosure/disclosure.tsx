import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { createContext, use, useId, useState } from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { cn } from "@/lib/utils/classnames";

interface DisclosureGroupContext {
  open: string | null;
  setOpen: (id: string | null) => void;
}

const DisclosureGroupContext = createContext<DisclosureGroupContext | null>(null);

const useDisclosureGroupContext = () => use(DisclosureGroupContext);

const DisclosureGroup = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<string | null>(null);

  return <DisclosureGroupContext value={{ open, setOpen }}>{children}</DisclosureGroupContext>;
};

interface DisclosureContext {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DisclosureContext = createContext<DisclosureContext | null>(null);

const useDisclosureContext = () => {
  const context = use(DisclosureContext);

  if (!context) throw new Error("Disclosure components must be used within an Disclosure");

  return context;
};

interface DisclosureProps extends React.ComponentPropsWithRef<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Disclosure = ({
  defaultOpen,
  open: propsOpen,
  onOpenChange,
  children,
  ...props
}: DisclosureProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const generatedId = useId();
  const id = props.id ?? generatedId;

  const group = useDisclosureGroupContext();

  let open = propsOpen ?? internalOpen;

  let setOpen = (open: boolean) => {
    setInternalOpen(open);
    onOpenChange?.(open);
  };

  if (group) {
    open = group.open === id;

    setOpen = (open: boolean) => {
      group.setOpen(open ? id : null);
    };
  }

  return (
    <DisclosureContext value={{ open, setOpen, id }}>
      <DisclosureGroupContext value={null}>
        <div {...props}>{children}</div>
      </DisclosureGroupContext>
    </DisclosureContext>
  );
};

interface DisclosureTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const DisclosureTrigger = ({
  children,
  onClick,
  asChild,
  className,
  ...props
}: DisclosureTriggerProps) => {
  const { open, setOpen, id } = useDisclosureContext();

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) setOpen(!open);
      }}
      aria-expanded={open}
      aria-controls={getContentId(id)}
      data-state={open ? "open" : "closed"}
      className={cn(
        "focus-visible:ring-(length:--ring-width) flex w-full items-center justify-between text-left outline-none ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

const getContentId = (id: string) => `${id}-Disclosure-content`;

// When interpolate-size / calc-size are Baseline, we can simply animate height: 0 to auto
const DisclosureContent = ({
  children,
  className,
  ...props
}: Omit<React.ComponentPropsWithRef<"div">, "id">) => {
  const { open, id } = useDisclosureContext();

  return (
    <div
      id={getContentId(id)}
      data-state={open ? "open" : "closed"}
      className={cn(
        "grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none",
        "data-[state=closed]:invisible data-[state=open]:grid-rows-[1fr]",
      )}
    >
      <div className={cn("min-h-0 overflow-hidden", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

const DisclosureChevron = ({ className, ...props }: React.ComponentPropsWithRef<"span">) => {
  const { open } = useDisclosureContext();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "p-1 transition-transform duration-200 ease-out motion-reduce:transition-none",
        open && "rotate-180",
        className,
      )}
      {...props}
    >
      <CaretDownIcon />
    </span>
  );
};

const CompoundDisclosure = Object.assign(Disclosure, {
  Group: DisclosureGroup,
  Trigger: DisclosureTrigger,
  Content: DisclosureContent,
  Chevron: DisclosureChevron,
});

export { CompoundDisclosure as Disclosure };
