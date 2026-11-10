import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

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
