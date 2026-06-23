import { OTPInput } from "@/foundations/ui/otp-input/otp-input";

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
