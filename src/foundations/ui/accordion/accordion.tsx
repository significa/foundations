"use client";

import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { createContext, use, useId, useState } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";

interface AccordionGroupContext {
  open: string | null;
  setOpen: (id: string | null) => void;
}

// let's keep an eye on calc-size
// https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size
// when it's generally available, we can avoid the use of `motion` in this component

const AccordionGroupContext = createContext<AccordionGroupContext | null>(null);

const useAccordionGroupContext = () => use(AccordionGroupContext);

const AccordionGroup = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AccordionGroupContext value={{ open, setOpen }}>
      {children}
    </AccordionGroupContext>
  );
};

interface AccordionContext {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AccordionContext = createContext<AccordionContext | null>(null);

const useAccordionContext = () => {
  const context = use(AccordionContext);

  if (!context)
    throw new Error("Accordion components must be used within an Accordion");

  return context;
};

interface AccordionProps extends React.ComponentPropsWithRef<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Accordion = ({
  defaultOpen,
  open: propsOpen,
  onOpenChange,
  children,
  ...props
}: AccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const generatedId = useId();
  const id = props.id ?? generatedId;

  const group = useAccordionGroupContext();

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
    <AccordionContext value={{ open, setOpen, id }}>
      <div {...props}>{children}</div>
    </AccordionContext>
  );
};

interface AccordionTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const AccordionTrigger = ({
  children,
  onClick,
  asChild,
  className,
  ...props
}: AccordionTriggerProps) => {
  const { open, setOpen, id } = useAccordionContext();

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
      className={cn("ring-ring outline-none focus-visible:ring-4", className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const getContentId = (id: string) => `${id}-accordion-content`;

const AccordionContent = ({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "id"> & { className?: string }) => {
  const { open, id } = useAccordionContext();

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

const AccordionChevron = () => {
  const { open } = useAccordionContext();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "ease-out-cubic p-1 transition-transform duration-100",
        open && "rotate-180"
      )}
    >
      <CaretDown />
    </span>
  );
};

export {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionGroup,
  AccordionChevron,
};
