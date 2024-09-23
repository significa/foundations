import { Input } from 'components/foundations/Input';

export function InputError() {
  return (
    <Input
      defaultValue="johndoe[].significa.co"
      error
      label="Email"
      placeholder="egg@signfifica.co"
    />
  );
}
