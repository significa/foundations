"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Fieldset,
  Legend,
} from "@/foundations/guides/accessible-forms/fieldset";
import { Button } from "@/foundations/ui/button/button";

import { Field } from "../field";
import { FieldDescription } from "../field-description";
import { FieldError } from "../field-error";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Radio, RadioGroup } from "./radio";
import { Select } from "./select";
import { Textarea } from "./textarea";

const schema = z.object({
  company: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  country: z.string().min(1, "Please select a country"),
  message: z.string().optional(),
  preference: z.enum(["email", "phone"], {
    errorMap: () => ({ message: "Please select a preference" }),
  }),
  newsletter: z.boolean(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Please accept the terms and conditions" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function FieldPreview() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="mx-auto max-w-md p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Fieldset>
          <Legend>Personal information</Legend>

          <Field className="flex flex-col gap-2">
            <Label>Company</Label>
            <Input {...register("company")} />
          </Field>

          <Field className="flex flex-col gap-2">
            <div>
              <Label>Name</Label>
              <FieldDescription>
                This is a description very very long description
              </FieldDescription>
            </div>
            <Input {...register("name", { required: true })} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field className="flex flex-col gap-2">
            <div>
              <Label>Email</Label>
              <FieldDescription>Your work e-mail address</FieldDescription>
            </div>
            <Input type="email" {...register("email", { required: true })} />
            <FieldDescription>
              Your work e-mail address is preferred because it is more secure.
              Please ask your administrator to whitelist the significa.co
              domain.
            </FieldDescription>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field className="flex flex-col gap-2">
            <div>
              <Label>Country</Label>
              <FieldDescription>
                Your country is required to continue with the registration.
              </FieldDescription>
            </div>
            <Select {...register("country")}>
              <option value="" disabled>
                Select a country
              </option>
              {["United States", "Canada", "United Kingdom", "Australia"].map(
                (country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                )
              )}
            </Select>
            <FieldError>{errors.country?.message}</FieldError>
          </Field>

          <Field className="flex flex-col gap-2">
            <Label>Message</Label>
            <Textarea {...register("message")} />
            <FieldError>{errors.message?.message}</FieldError>
          </Field>
        </Fieldset>

        <Fieldset>
          <Legend>Communication</Legend>

          <Field className="flex flex-col gap-2">
            <Label>Contact preference</Label>

            <RadioGroup required className="flex flex-col gap-2">
              <Field className="flex items-center gap-2">
                <Radio
                  {...register("preference", { required: true })}
                  value="email"
                />
                <Label>Email</Label>
              </Field>
              <Field className="flex items-center gap-2">
                <Radio
                  {...register("preference", { required: true })}
                  value="phone"
                />
                <Label>Phone</Label>
              </Field>
            </RadioGroup>

            <FieldError />
          </Field>

          <div className="space-y-2">
            <Field className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox {...register("terms", { required: true })} />
                <Label>Accept terms and conditions</Label>
              </div>
              <FieldError>{errors.terms?.message}</FieldError>
            </Field>

            <Field className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox {...register("newsletter")} />
                <Label>Subscribe to newsletter</Label>
              </div>
              <FieldError>{errors.newsletter?.message}</FieldError>
            </Field>
          </div>
        </Fieldset>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
