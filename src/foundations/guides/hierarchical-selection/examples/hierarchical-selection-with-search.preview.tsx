"use client";

import { useState } from "react";

import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "@/foundations/ui/disclosure/disclosure";
import { Divider } from "@/foundations/ui/divider/divider";
import { Input } from "@/foundations/ui/input/input";

import { filterHierarchicalData,HierarchicalItem } from "../hierarchical-data";
import { useHierarchicalSelection } from "../use-hierarchical-selection";

const sampleData: HierarchicalItem[] = [
  {
    id: "europe",
    label: "Europe",
    children: [
      { id: "portugal", label: "Portugal" },
      { id: "spain", label: "Spain" },
      { id: "france", label: "France" },
      { id: "germany", label: "Germany" },
      { id: "italy", label: "Italy" },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    children: [
      { id: "south-korea", label: "South Korea" },
      { id: "japan", label: "Japan" },
      { id: "china", label: "China" },
      { id: "thailand", label: "Thailand" },
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

export default function HierarchicalSelectionWithSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedArray,
    toggleItem,
    toggleParent,
    toggleParentOpen,
    toggleAll,
    getParentStatus,
    getSelectAllStatus,
    isSelected,
    isParentOpen,
  } = useHierarchicalSelection({
    defaultOpened: ["europe", "asia"],
    onSelectionChange: (selected) => {
      console.log("Selected items:", selected);
    },
  });

  // Filter data based on search query
  const filteredData = filterHierarchicalData(sampleData, searchQuery);
  const selectAllStatus = getSelectAllStatus(sampleData);

  return (
    <div className="w-full space-y-4">
      {/* Search input */}
      <Input
        placeholder="Search countries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {/* Select all option - only show when not searching */}
      {!searchQuery && (
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={selectAllStatus.checked}
            indeterminate={selectAllStatus.indeterminate}
            onChange={(e) => toggleAll(sampleData, e.target.checked)}
          />
          <span className="cursor-pointer text-base font-medium">
            All Countries
          </span>
        </label>
      )}

      <Divider />

      {/* Results */}
      {filteredData.length === 0 && searchQuery ? (
        <p className="text-foreground-secondary p-2 text-sm">
          No countries found
        </p>
      ) : (
        <div className="space-y-1">
          {filteredData.map((parent) => {
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
          })}
        </div>
      )}

      {/* Selected items display */}
      <div className="bg-background-secondary mt-4 rounded p-3">
        <p className="mb-1 text-sm font-medium">Selected countries:</p>
        <p className="text-foreground-secondary text-sm">
          {selectedArray.length > 0 ? selectedArray.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
