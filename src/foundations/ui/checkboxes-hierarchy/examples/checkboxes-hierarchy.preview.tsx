"use client";
import CheckboxesHierarchy, {
  Entry,
} from "@/foundations/ui/checkboxes-hierarchy/checkboxes-hierarchy";

export default function CheckboxesHierarchyExample() {
  const input: Entry[] = [
    {
      label: "Europe",
      value: "eu",
      children: [
        { label: "Portugal", value: "pt" },
        { label: "Spain", value: "es" },
        { label: "France", value: "fr" },
      ],
    },
    {
      label: "Asia",
      value: "as",
      children: [
        { label: "South Korea", value: "sk" },
        { label: "Japan", value: "jp" },
      ],
    },
  ];

  return (
    <CheckboxesHierarchy
      levels={input}
      disabledChildren={["pt"]}
      defaultParentsOpened={["eu", "as"]}
      defaultChildrenSelected={["es"]}
      showSelectAllOption
      selectAllLabel="All Countries"
      className="h-full w-[250px]"
      searchable
      searchPlaceholder="Search countries..."
      searchEmptyMessage="No countries found."
    ></CheckboxesHierarchy>
  );
}
