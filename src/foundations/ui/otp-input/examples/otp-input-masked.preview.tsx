import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

export default function OTPInputMaskedExample() {
  return (
    <OTPInput masked>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
