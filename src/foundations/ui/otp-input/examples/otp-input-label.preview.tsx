import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";

export default function OTPInputLabelExample() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-medium text-foreground" htmlFor="otp">
        Verification code
      </label>
      <OTPInput id="otp">
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Divider />
        <OTPInput.Cell />
        <OTPInput.Cell />
        <OTPInput.Cell />
      </OTPInput>
    </div>
  );
}
