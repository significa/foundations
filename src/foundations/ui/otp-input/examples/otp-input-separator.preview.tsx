import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputSeparatorExample() {
  return (
    <OTPInput>
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
