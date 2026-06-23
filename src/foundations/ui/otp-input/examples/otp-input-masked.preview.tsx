import { OTPInput } from "@/foundations/ui/otp-input/otp-input";

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
