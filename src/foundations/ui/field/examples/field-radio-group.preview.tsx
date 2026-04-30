import { useState } from 'react';
import { Field } from '@/foundations/ui/field/field';
import { Radio } from '@/foundations/ui/radio/radio';

const plans = [
  { value: 'free', label: 'Free', description: 'For personal projects.' },
  { value: 'pro', label: 'Pro', description: '$12/mo. For small teams.' },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Custom pricing. SSO and audit logs.',
  },
];

export default function FieldRadioGroupPreview() {
  const [plan, setPlan] = useState('free');

  return (
    <fieldset className="flex w-72 flex-col gap-3">
      <legend className="font-medium text-base">Plan</legend>
      {plans.map((p) => (
        <Field key={p.value} className="flex-row items-center gap-3">
          <Field.Control>
            <Radio
              name="plan"
              value={p.value}
              checked={plan === p.value}
              onChange={() => setPlan(p.value)}
            />
          </Field.Control>
          <div className="flex flex-col">
            <Field.Label>{p.label}</Field.Label>
            <Field.Description>{p.description}</Field.Description>
          </div>
        </Field>
      ))}
    </fieldset>
  );
}
