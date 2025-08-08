"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/foundations/ui/button/button";
import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "@/foundations/ui/disclosure/disclosure";
import { Input } from "@/foundations/ui/input/input";
import { Label } from "@/foundations/ui/label/label";
import { cn } from "@/lib/utils";

import { filterHierarchicalData, HierarchicalItem } from "../hierarchical-data";
import { useHierarchicalSelection } from "../use-hierarchical-selection";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

type FormData = z.infer<typeof schema>;

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
  data: HierarchicalItem[];
  error?: string;
}

function HierarchicalSelectionField({
  value,
  onChange,
  data,
  error,
}: HierarchicalSelectionFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    toggleItem,
    toggleParent,
    toggleParentOpen,
    getParentStatus,
    isSelected,
    isParentOpen,
  } = useHierarchicalSelection({
    defaultSelected: value,
    defaultOpened: ["europe"],
    onSelectionChange: onChange,
  });

  const filteredData = filterHierarchicalData(data, searchQuery);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search countries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <div
        className={cn(
          "max-h-64 space-y-1 overflow-y-auto rounded-md border p-3",
          error && "border-red-500"
        )}
      >
        {filteredData.length === 0 && searchQuery ? (
          <p className="text-foreground-secondary p-2 text-sm">
            No countries found
          </p>
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
                    <span className="cursor-pointer text-base font-medium">
                      {parent.label}
                    </span>
                  </label>

                  {!searchQuery && (
                    <DisclosureTrigger
                      onClick={() => toggleParentOpen(parent.id)}
                      className="w-auto cursor-pointer rounded p-1"
                    >
                      <DisclosureChevron />
                    </DisclosureTrigger>
                  )}
                </div>

                <DisclosureContent>
                  <div className="mt-2 ml-6 space-y-2">
                    {parent.children?.map((child) => (
                      <label
                        key={child.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Checkbox
                          checked={isSelected(child.id)}
                          onChange={() => toggleItem(child.id)}
                        />
                        <span className="cursor-pointer text-base font-medium">
                          {child.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </DisclosureContent>
              </Disclosure>
            );
          })
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function HierarchicalSelectionForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      countries: ["spain"],
    },
  });

  const watchedCountries = watch("countries");

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(
      `Form submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nCountries: ${data.countries.join(", ")}`
    );

    console.log("Form data:", data);
  };

  return (
    <div className="mx-auto w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Registration Form</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Countries of Interest *</Label>
          <p className="text-foreground-secondary mb-3 text-sm">
            Select the countries you are interested in for our services
          </p>

          <Controller
            name="countries"
            control={control}
            render={({ field }) => (
              <HierarchicalSelectionField
                value={field.value}
                onChange={field.onChange}
                data={sampleData}
                error={errors.countries?.message}
              />
            )}
          />
        </div>

        <div className="bg-background-secondary rounded p-3">
          <p className="mb-1 text-sm font-medium">
            Selected countries ({watchedCountries.length}):
          </p>
          <p className="text-foreground-secondary text-sm">
            {watchedCountries.length > 0 ? watchedCountries.join(", ") : "None"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
