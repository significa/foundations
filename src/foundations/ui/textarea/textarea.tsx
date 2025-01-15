"use client";

import { useEffect, useRef, useState } from "react";
import { VariantProps } from "cva";

import { cn } from "@/lib/utils";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { inputStyle } from "@/foundations/ui/input/input";
import { useField } from "@/foundations/ui/field/field";

interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Textarea = ({
  className,
  invalid: propsInvalid,
  variant,
  id,
  ...props
}: TextareaProps) => {
  const fieldCtx = useField();

  const invalid =
    propsInvalid || !!fieldCtx?.["aria-errormessage"] || undefined;

  return (
    <textarea
      data-invalid={invalid}
      aria-invalid={invalid}
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
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
