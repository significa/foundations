import { revalidateLogic, useForm, useSelector } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Field } from "#/foundations/ui/field/field.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function FieldWithTanstackFormPreview() {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validationLogic: revalidateLogic({ mode: "blur", modeAfterSubmission: "change" }),
    validators: { onDynamic: schema },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    },
  });
  // Form-level errors land on every field; show them once it was left or the form submitted.
  const isSubmitted = useSelector(form.store, (state) => state.submissionAttempts > 0);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="flex w-80 flex-col gap-4"
    >
      <form.Field name="email">
        {(field) => {
          const error =
            field.state.meta.isBlurred || isSubmitted
              ? field.state.meta.errors[0]?.message
              : undefined;
          return (
            <Field invalid={!!error}>
              <Field.Label>Email</Field.Label>
              <Field.Control>
                <Input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field.Control>
              <Field.Error>{error}</Field.Error>
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const error =
            field.state.meta.isBlurred || isSubmitted
              ? field.state.meta.errors[0]?.message
              : undefined;
          return (
            <Field invalid={!!error}>
              <Field.Label>Password</Field.Label>
              <Field.Control>
                <Input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field.Control>
              <Field.Description>At least 8 characters.</Field.Description>
              <Field.Error>{error}</Field.Error>
            </Field>
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" isLoading={isSubmitting}>
            Sign up
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
