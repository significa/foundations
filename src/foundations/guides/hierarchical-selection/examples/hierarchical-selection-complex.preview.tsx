"use client";

import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "@/foundations/ui/disclosure/disclosure";
import { Divider } from "@/foundations/ui/divider/divider";
import { Input } from "@/foundations/ui/input/input";
import { cn } from "@/lib/utils";

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
      { id: "germany", label: "Germany", disabled: true },
      { id: "italy", label: "Italy" },
      { id: "netherlands", label: "Netherlands" },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    disabled: true, // Entire region disabled
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
      { id: "mexico", label: "Mexico", disabled: true },
    ],
  },
  {
    id: "oceania",
    label: "Oceania",
    children: [
      { id: "australia", label: "Australia" },
      { id: "new-zealand", label: "New Zealand" },
      { id: "fiji", label: "Fiji" },
    ],
  },
];

export default function ComplexHierarchicalSelection() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedArray,
    openedArray,
    toggleItem,
    toggleParent,
    toggleParentOpen,
    toggleAll,
    clearSelection,
    selectItems,
    getParentStatus,
    getSelectAllStatus,
    isSelected,
    isParentOpen,
  } = useHierarchicalSelection({
    defaultSelected: ["portugal", "spain"],
    defaultOpened: ["europe"],
    onSelectionChange: (selected) => {
      console.log("Selected items:", selected);
    },
  });

  // Filter data based on search query
  const filteredData = filterHierarchicalData(sampleData, searchQuery);
  const selectAllStatus = getSelectAllStatus(sampleData);

  return (
    <div className="w-full space-y-4">
      {/* Quick actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          disabled={selectedArray.length === 0}
        >
          Clear All
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectItems(["portugal", "spain", "france"])}
        >
          Select EU Core
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectItems(["united-states", "canada", "australia"])}
        >
          Select English Speaking
        </Button>
      </div>

      <Input
        placeholder="Search countries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />

      {/* Select all option - only show when not searching */}
      {!searchQuery && (
        <label className="flex cursor-pointer items-center gap-2 rounded">
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
            const isParentDisabled = parent.disabled;

            return (
              <Disclosure key={parent.id} open={isOpen || !!searchQuery}>
                <div className="flex items-center justify-between gap-2">
                  <label
                    className={cn(
                      "flex flex-1 items-center gap-2",
                      isParentDisabled ? "opacity-50" : "cursor-pointer"
                    )}
                  >
                    <Checkbox
                      checked={parentStatus.checked}
                      indeterminate={parentStatus.indeterminate}
                      disabled={isParentDisabled}
                      onChange={(e) => toggleParent(parent, e.target.checked)}
                    />
                    <span
                      className={cn(
                        "text-base font-medium",
                        isParentDisabled ? "" : "cursor-pointer"
                      )}
                    >
                      {parent.label}
                      {isParentDisabled && (
                        <span className="text-foreground-secondary ml-2 text-xs">
                          (Disabled)
                        </span>
                      )}
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
                  <div className="border-border mt-2 ml-6 space-y-2 border-l-2 pl-4">
                    {parent.children?.map((child) => {
                      const isChildDisabled =
                        child.disabled || isParentDisabled;

                      return (
                        <label
                          key={child.id}
                          className={cn(
                            "flex items-center gap-2",
                            isChildDisabled ? "opacity-50" : "cursor-pointer"
                          )}
                        >
                          <Checkbox
                            checked={isSelected(child.id)}
                            disabled={isChildDisabled}
                            onChange={() => toggleItem(child.id)}
                          />
                          <span
                            className={cn(
                              "text-base font-medium",
                              isChildDisabled ? "" : "cursor-pointer"
                            )}
                          >
                            {child.label}
                            {child.disabled && (
                              <span className="text-foreground-secondary ml-2 text-xs">
                                (Disabled)
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </DisclosureContent>
              </Disclosure>
            );
          })}
        </div>
      )}

      {/* Status display */}
      <div className="bg-background-secondary mt-4 space-y-2 rounded p-3">
        <div>
          <p className="mb-1 text-sm font-medium">
            Selected countries ({selectedArray.length}):
          </p>
          <p className="text-foreground-secondary text-sm">
            {selectedArray.length > 0 ? selectedArray.join(", ") : "None"}
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">
            Opened regions ({openedArray.length}):
          </p>
          <p className="text-foreground-secondary text-sm">
            {openedArray.length > 0 ? openedArray.join(", ") : "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
