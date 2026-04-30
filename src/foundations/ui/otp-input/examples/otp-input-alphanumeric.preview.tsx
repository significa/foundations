import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputAlphanumericExample() {
  return (
    <OTPInput inputMode="text">
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Divider />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
