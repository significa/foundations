import { useState } from "react";
import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

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
        <p className="text-sm font-medium text-foreground">Enter verification code</p>
        <p className="text-xs text-foreground-secondary">
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
        <p className="text-xs text-foreground-secondary">
          Filled: <span className="font-mono text-foreground">{value}</span>
        </p>
      )}
    </form>
  );
}
