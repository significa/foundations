import { revalidateLogic, useForm, useSelector } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import {
  filterHierarchicalData,
  type HierarchicalItem,
} from "#/foundations/guides/hierarchical-selection/hierarchical-data.ts";
import { useHierarchicalSelection } from "#/foundations/guides/hierarchical-selection/use-hierarchical-selection.tsx";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Checkbox } from "#/foundations/ui/checkbox/checkbox.tsx";
import { Disclosure } from "#/foundations/ui/disclosure/disclosure.tsx";
import { Field } from "#/foundations/ui/field/field.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";
import { cn } from "#/lib/utils/classnames.ts";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

const sampleData: HierarchicalItem[] = [
  {
    id: "europe",
    label: "Europe",
    children: [
      { id: "portugal", label: "Portugal" },
      { id: "spain", label: "Spain" },
      { id: "france", label: "France" },
      { id: "germany", label: "Germany" },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    children: [
      { id: "south-korea", label: "South Korea" },
      { id: "japan", label: "Japan" },
      { id: "china", label: "China" },
    ],
  },
  {
    id: "north-america",
    label: "North America",
    children: [
      { id: "united-states", label: "United States" },
      { id: "canada", label: "Canada" },
      { id: "mexico", label: "Mexico" },
    ],
  },
];

interface HierarchicalSelectionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  data: HierarchicalItem[];
  error?: string;
}

function HierarchicalSelectionField({
  value,
  onChange,
  onBlur,
  data,
  error,
}: HierarchicalSelectionFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { toggleItem, toggleParent, toggleParentOpen, getParentStatus, isSelected, isParentOpen } =
    useHierarchicalSelection({
      defaultSelected: value,
      defaultOpened: ["europe"],
      onSelectionChange: onChange,
    });

  const filteredData = filterHierarchicalData(data, searchQuery);

  return (
    <fieldset
      aria-label="Countries"
      className="min-w-0 space-y-3"
      // Blurred once focus leaves the whole control, not when it moves between its checkboxes.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onBlur?.();
      }}
    >
      <Input
        placeholder="Search countries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <div
        className={cn(
          "max-h-64 space-y-1 overflow-y-auto rounded-md border p-3",
          error && "border-red-500",
        )}
      >
        {filteredData.length === 0 && searchQuery ? (
          <p className="p-2 text-sm text-foreground-secondary">No countries found</p>
        ) : (
          filteredData.map((parent) => {
            const parentStatus = getParentStatus(parent);
            const isOpen = isParentOpen(parent.id);

            return (
              <Disclosure key={parent.id} open={isOpen || !!searchQuery}>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex flex-1 cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={parentStatus.checked}
                      indeterminate={parentStatus.indeterminate}
                      onChange={(e) => toggleParent(parent, e.target.checked)}
                    />
                    <span className="cursor-pointer text-base font-medium">{parent.label}</span>
                  </label>

                  {!searchQuery && (
                    <Disclosure.Trigger
                      onClick={() => toggleParentOpen(parent.id)}
                      className="w-auto cursor-pointer rounded p-1"
                    >
                      <Disclosure.Chevron />
                    </Disclosure.Trigger>
                  )}
                </div>

                <Disclosure.Content>
                  <div className="mt-2 ml-6 space-y-2">
                    {parent.children?.map((child) => (
                      <label key={child.id} className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={isSelected(child.id)}
                          onChange={() => toggleItem(child.id)}
                        />
                        <span className="cursor-pointer text-base font-medium">{child.label}</span>
                      </label>
                    ))}
                  </div>
                </Disclosure.Content>
              </Disclosure>
            );
          })
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

export default function HierarchicalSelectionForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      countries: ["spain"],
    },
    validationLogic: revalidateLogic({ mode: "blur", modeAfterSubmission: "change" }),
    validators: { onDynamic: schema },
    onSubmit: async ({ value }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `Form submitted!\n\nName: ${value.name}\nEmail: ${value.email}\nCountries: ${value.countries.join(", ")}`,
      );
    },
  });
  // Form-level errors land on every field; show them once it was left or the form submitted.
  const isSubmitted = useSelector(form.store, (state) => state.submissionAttempts > 0);

  return (
    <div className="mx-auto w-full p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold">Registration Form</h2>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="name">
            {(field) => {
              const error =
                field.state.meta.isBlurred || isSubmitted
                  ? field.state.meta.errors[0]?.message
                  : undefined;
              return (
                <Field invalid={!!error}>
                  <Field.Label>Name *</Field.Label>
                  <Field.Control>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter your name"
                    />
                  </Field.Control>
                  <Field.Error>{error}</Field.Error>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const error =
                field.state.meta.isBlurred || isSubmitted
                  ? field.state.meta.errors[0]?.message
                  : undefined;
              return (
                <Field invalid={!!error}>
                  <Field.Label>Email *</Field.Label>
                  <Field.Control>
                    <Input
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter your email"
                    />
                  </Field.Control>
                  <Field.Error>{error}</Field.Error>
                </Field>
              );
            }}
          </form.Field>
        </div>

        <Field>
          <Field.Label>Countries of Interest *</Field.Label>
          <Field.Description>
            Select the countries you are interested in for our services
          </Field.Description>

          <form.Field name="countries">
            {(field) => (
              <HierarchicalSelectionField
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                data={sampleData}
                error={
                  field.state.meta.isBlurred || isSubmitted
                    ? field.state.meta.errors[0]?.message
                    : undefined
                }
              />
            )}
          </form.Field>
        </Field>

        <form.Subscribe selector={(state) => state.values.countries}>
          {(countries) => (
            <div className="rounded bg-background-secondary p-3">
              <p className="mb-1 text-sm font-medium">Selected countries ({countries.length}):</p>
              <p className="text-sm text-foreground-secondary">
                {countries.length > 0 ? countries.join(", ") : "None"}
              </p>
            </div>
          )}
        </form.Subscribe>

        <div className="flex gap-3">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="min-w-30">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>

          <Button type="button" variant="ghost" onClick={() => window.location.reload()}>
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
