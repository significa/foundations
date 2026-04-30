import { useState } from 'react';

import { Button } from '@/foundations/ui/button/button';
import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

const LENGTH = 6;

export default function OTPInputFormExample() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.length < LENGTH) {
      setInvalid(true);
      return;
    }
    const data = new FormData(e.currentTarget);
    setSubmitted(data.get('otp') as string);
  }

  function handleChange(v: string) {
    setValue(v);
    if (invalid) setInvalid(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4">
      <OTPInput onChange={handleChange} invalid={invalid}>
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
