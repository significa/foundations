"use client";

import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  DisclosureChevron,
} from "@/foundations/ui/disclosure/disclosure";

import { HierarchicalItem } from "../hierarchical-data";
import { useHierarchicalSelection } from "../use-hierarchical-selection";

const sampleData: HierarchicalItem[] = [
  {
    id: "europe",
    label: "Europe",
    children: [
      { id: "portugal", label: "Portugal" },
      { id: "spain", label: "Spain" },
      { id: "france", label: "France" },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    children: [
      { id: "south-korea", label: "South Korea" },
      { id: "japan", label: "Japan" },
    ],
  },
];

export default function BasicHierarchicalSelection() {
  const {
    selectedArray,
    toggleItem,
    toggleParent,
    toggleParentOpen,
    getParentStatus,
    isSelected,
    isParentOpen,
  } = useHierarchicalSelection({
    defaultSelected: ["spain"],
    defaultOpened: ["europe"],
    onSelectionChange: (selected) => {
      console.log("Selected items:", selected);
    },
  });

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <p className="text-foreground-secondary text-sm">
          Selected: {selectedArray.join(", ") || "None"}
        </p>
      </div>

      <div className="space-y-1">
        {sampleData.map((parent) => {
          const parentStatus = getParentStatus(parent);
          const isOpen = isParentOpen(parent.id);

          return (
            <Disclosure key={parent.id} open={isOpen}>
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

                <DisclosureTrigger
                  onClick={() => toggleParentOpen(parent.id)}
                  className="w-auto cursor-pointer rounded p-1"
                >
                  <DisclosureChevron />
                </DisclosureTrigger>
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
        })}
      </div>
    </div>
  );
}
