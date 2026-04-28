import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputPlaceholderExample() {
  return (
    <OTPInput placeholder="-">
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
