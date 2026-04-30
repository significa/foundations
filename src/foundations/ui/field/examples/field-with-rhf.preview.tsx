import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/foundations/ui/button/button';
import { Field } from '@/foundations/ui/field/field';
import { Input } from '@/foundations/ui/input/input';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

type FormValues = z.infer<typeof schema>;

export default function FieldWithRhfPreview() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('submitted', values);
  });

  return (
    <form onSubmit={onSubmit} className="flex w-80 flex-col gap-4">
      <Field invalid={!!errors.email}>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input type="email" {...register('email')} />
        </Field.Control>
        <Field.Error>{errors.email?.message}</Field.Error>
      </Field>

      <Field invalid={!!errors.password}>
        <Field.Label>Password</Field.Label>
        <Field.Control>
          <Input type="password" {...register('password')} />
        </Field.Control>
        <Field.Description>At least 8 characters.</Field.Description>
        <Field.Error>{errors.password?.message}</Field.Error>
      </Field>

      <Button type="submit" isLoading={isSubmitting}>
        Sign up
      </Button>
    </form>
  );
}
