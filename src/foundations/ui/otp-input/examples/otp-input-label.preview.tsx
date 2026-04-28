import { Label } from '@/foundations/ui/label/label';
import { OTPInput } from '@/foundations/ui/otp-input/otp-input';

export default function OTPInputLabelExample() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="otp">Verification code</Label>
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
