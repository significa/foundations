import { useState } from "react";
import { OTPInput } from "@/foundations/ui/otp-input/otp-input";

export default function OTPInputPasswordManagerExample() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleComplete = (v: string) => {
    setSubmitted(true);
    setValue(v);
  };

  return (
    <form className="flex flex-col items-center gap-6" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-medium text-foreground text-sm">Enter verification code</p>
        <p className="text-foreground-secondary text-xs">
          Open 1Password and autofill the 6-digit code.
        </p>
      </div>

      <OTPInput value={value} onChange={setValue} onFill={handleComplete}>
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Divider />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
      </OTPInput>

      {submitted && (
        <p className="text-foreground-secondary text-xs">
          Filled: <span className="font-mono text-foreground">{value}</span>
        </p>
      )}
    </form>
  );
}
