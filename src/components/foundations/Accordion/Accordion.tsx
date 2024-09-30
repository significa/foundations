import React, { ReactNode } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { CaretDown } from '../Icons';
import { cn } from 'lib/tailwind';

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item> & {
  children: ReactNode;
  className?: string;
};

type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  children: ReactNode;
  className?: string;
};

type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content> & {
  children: ReactNode;
  className?: string;
};

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  children: ReactNode;
  className?: string;
};

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Item
      className={cn(
        'mt-px bg-white overflow-hidden',
        'focus-within:relative focus-within:z-10 focus-within:shadow-accent focus-within:shadow-[0_0_0_1px]',
        'first:mt-0 first:rounded-t last:rounded-b',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AccordionPrimitive.Item>
  )
);

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group bg-white px-5 flex items-center justify-between flex-1',
          'shadow-accent shadow-[0_1px_0] h-10 cursor-default leading-none outline-none',
          'focus-visible:ring focus-visible:ring-transparent focus-visible:ring-offset-0',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <CaretDown
          aria-hidden
          className="size-4 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Content
      className={cn(
        'bg-white overflow-hidden',
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-4 px-5">{children}</div>
    </AccordionPrimitive.Content>
  )
);

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, className }, forwardedRef) => {
    return (
      <AccordionPrimitive.Root
        className={cn('w-[300px] bg-primary rounded-md', 'shadow-lg shadow-black/5', className)}
        type="single"
        defaultValue="item-1"
        collapsible
        ref={forwardedRef}
      >
        {children}
      </AccordionPrimitive.Root>
    );
  }
);
