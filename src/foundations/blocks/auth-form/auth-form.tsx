import { Button } from '@/foundations/ui/button/button';
import { Checkbox } from '@/foundations/ui/checkbox/checkbox';
import { Divider } from '@/foundations/ui/divider/divider';
import { Field } from '@/foundations/ui/field/field';
import { Input } from '@/foundations/ui/input/input';
import { cn } from '@/lib/utils/classnames';

interface AuthFormProps extends React.ComponentPropsWithRef<'form'> {
  /** Heading shown above the form. */
  title?: string;
  /** Supporting line under the heading. */
  description?: string;
}

const AuthForm = ({
  title = 'Sign in',
  description = 'Welcome back. Enter your details to continue.',
  className,
  ...props
}: AuthFormProps) => {
  return (
    <form
      className={cn(
        'mx-auto flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-background p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-foreground text-xl">{title}</h1>
        <p className="text-foreground-secondary text-sm">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Field>
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <Input
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
            />
          </Field.Control>
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <Field.Label>Password</Field.Label>
            <a
              href="/forgot-password"
              className="text-foreground-secondary text-sm hover:text-foreground"
            >
              Forgot?
            </a>
          </div>
          <Field.Control>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field.Control>
        </Field>

        <label className="flex items-center gap-2 text-foreground-secondary text-sm">
          <Checkbox name="remember" />
          Remember me for 30 days
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" className="w-full">
          Sign in
        </Button>

        <div className="flex items-center gap-3">
          <Divider className="flex-1" />
          <span className="text-foreground-secondary text-xs">OR</span>
          <Divider className="flex-1" />
        </div>

        <Button type="button" variant="outline" className="w-full">
          Continue with email link
        </Button>
      </div>

      <p className="text-center text-foreground-secondary text-sm">
        Don&apos;t have an account?{' '}
        <a href="/sign-up" className="text-foreground hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
};

export { AuthForm };
