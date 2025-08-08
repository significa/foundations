"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { createContext, use, useId, useState } from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { cn } from "@/lib/utils";

interface DisclosureGroupContext {
  open: string | null;
  setOpen: (id: string | null) => void;
}

// let's keep an eye on calc-size
// https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size
// when it's generally available, we can avoid the use of `motion` in this component

const DisclosureGroupContext = createContext<DisclosureGroupContext | null>(
  null
);

const useDisclosureGroupContext = () => use(DisclosureGroupContext);

const DisclosureGroup = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <DisclosureGroupContext value={{ open, setOpen }}>
      {children}
    </DisclosureGroupContext>
  );
};

interface DisclosureContext {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DisclosureContext = createContext<DisclosureContext | null>(null);

const useDisclosureContext = () => {
  const context = use(DisclosureContext);

  if (!context)
    throw new Error("Disclosure components must be used within an Disclosure");

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
      <div {...props}>{children}</div>
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
      type="button"
      onClick={(e) => {
        onClick?.(e);

        if (!e.defaultPrevented) setOpen(!open);
      }}
      aria-expanded={open}
      aria-controls={open ? getContentId(id) : undefined}
      data-open={open}
      className={cn(
        "ring-ring flex w-full items-center justify-between text-left outline-none focus-visible:ring-4",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

const getContentId = (id: string) => `${id}-Disclosure-content`;

const DisclosureContent = ({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "id" | "children"> & {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, id } = useDisclosureContext();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={getContentId(id)}
          className={cn("overflow-hidden", className)}
          data-open={open}
          transition={{ type: "spring", bounce: 0, visualDuration: 0.15 }}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DisclosureChevron = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"span">) => {
  const { open } = useDisclosureContext();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "ease-out-cubic p-1 transition-transform duration-100",
        open && "rotate-180",
        className
      )}
      {...props}
    >
      <CaretDownIcon />
    </span>
  );
};

export {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureGroup,
  DisclosureTrigger,
};
