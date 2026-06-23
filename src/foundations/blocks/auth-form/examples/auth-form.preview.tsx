import { AuthForm } from '@/foundations/blocks/auth-form/auth-form';

export const meta = {
  layout: 'centered',
  mode: 'iframe',
  size: 'block',
} as const;

export default function AuthFormPreview() {
  return <AuthForm onSubmit={(e) => e.preventDefault()} />;
}
