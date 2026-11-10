import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

export default function OTPInputExample() {
  return (
    <OTPInput>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
