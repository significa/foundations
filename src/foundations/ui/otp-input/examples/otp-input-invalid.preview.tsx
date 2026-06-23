import { OTPInput } from "@/foundations/ui/otp-input/otp-input";

export default function OTPInputInvalidExample() {
  return (
    <OTPInput defaultValue="123456" invalid>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
  );
}
