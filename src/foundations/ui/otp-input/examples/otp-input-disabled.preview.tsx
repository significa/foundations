import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputDisabledExample() {
  return (
    <OTPInput disabled>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
