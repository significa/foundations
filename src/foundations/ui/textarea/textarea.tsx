"use client";

import { VariantProps } from "cva";
import { useEffect, useRef, useState } from "react";

import { inputStyle } from "@/foundations/ui/input/input";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Textarea = ({ className, invalid, variant, ...props }: TextareaProps) => {
  return (
    <textarea
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        "h-auto resize-none py-2 leading-snug",
        className
      )}
      {...props}
    />
  );
};

// as soon as `field-sizing: content` is supported, we can remove this component and just use the Textarea

/**
 * A textarea that resizes as you type.
 */
const TextareaResize = ({ ref, ...props }: TextareaProps) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(props.value);

  const value = props.value ?? internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(event.target.value);
    props.onChange?.(event);
  };

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.style.height = "auto";
      internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={composeRefs(ref, internalRef)}
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
};

export { Textarea, TextareaResize };
