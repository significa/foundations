import { useState } from 'react';

import { Button } from '@/foundations/ui/button/button';
import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputFormExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitted(data.get('otp') as string);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4">
      <OTPInput>
        <OTPInput.Hidden name="otp" />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
      </OTPInput>
      <Button type="submit">Verify</Button>
      {submitted !== null && (
        <p className="text-foreground-secondary text-sm">
          Submitted: <span className="text-foreground">{submitted}</span>
        </p>
      )}
    </form>
  );
}
