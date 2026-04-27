import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputSeparatorExample() {
  return (
    <OTPInput>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Separator />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
