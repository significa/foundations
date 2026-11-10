import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

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
