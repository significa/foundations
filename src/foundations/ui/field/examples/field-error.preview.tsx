import { useState } from 'react';
import { Field } from '@/foundations/ui/field/field';
import { Input } from '@/foundations/ui/input/input';

export default function FieldErrorPreview() {
  const [value, setValue] = useState('not-an-email');
  const error =
    value.length > 0 && !value.includes('@')
      ? 'Please enter a valid email address.'
      : '';

  return (
    <Field invalid={!!error} className="w-72">
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <Input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="name@example.com"
        />
      </Field.Control>
      <Field.Error>{error}</Field.Error>
    </Field>
  );
}
