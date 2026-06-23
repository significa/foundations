import { Field } from "@/foundations/ui/field/field";
import { Input } from "@/foundations/ui/input/input";

export default function FieldPreview() {
  return (
    <Field className="w-72">
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <Input type="email" placeholder="name@example.com" />
      </Field.Control>
      <Field.Description>We'll never share your email with anyone else.</Field.Description>
    </Field>
  );
}
