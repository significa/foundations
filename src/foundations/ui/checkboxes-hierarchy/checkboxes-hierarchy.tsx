"use client";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

type CheckboxesHierarchyProps = {
  className?: string;
  levels?: Entry[];
  defaultChildrenSelected?: string[];
  defaultParentsOpened?: string[];
  disabledChildren?: string[];
  disabledParents?: string[];
  showSelectAllOption?: boolean;
  selectAllLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchEmptyMessage?: string;
  onSelectedChange?: (selectedValues: string[]) => void;
};

export type Entry = {
  label: string;
  value: string;
  /**
   * Optional array of child entries. Note: While the type allows for recursive nesting,
   * the component only renders two levels (parents and their immediate children).
   * Any deeper nesting will be ignored.
   */
  children?: Omit<Entry, "children">[];
};

const CheckboxesHierarchy = ({
  className,
  levels,
  defaultChildrenSelected = [],
  defaultParentsOpened = [],
  disabledChildren = [],
  disabledParents = [],
  showSelectAllOption = false,
  selectAllLabel = "All",
  searchable = false,
  searchPlaceholder = "Search...",
  searchEmptyMessage = "No results found",
  onSelectedChange,
}: CheckboxesHierarchyProps) => {
  // states
  const [selectedChildren, setSelectedChildren] = useState<string[]>(
    defaultChildrenSelected || []
  );
  const [openedParents, setOpenedParents] = useState<string[]>(
    defaultParentsOpened || []
  );
  const [searchQuery, setSearchQuery] = useState("");

  // memos
  const possibleChildren = useMemo(() => {
    const children: Entry[] = [];
    levels?.forEach((parent) => {
      if (parent.children) {
        children.push(...parent.children);
      }
    });
    return children;
  }, [levels]);

  const filteredLevels = useMemo(() => {
    if (!searchQuery || !levels) return levels;

    return levels
      .map((parent) => {
        const matchingChildren = parent.children?.filter((child) =>
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (parent.label.toLowerCase().includes(searchQuery.toLowerCase())) {
          return parent;
        } else if (matchingChildren?.length) {
          return { ...parent, children: matchingChildren };
        }
        return null;
      })
      .filter(Boolean) as Entry[];
  }, [levels, searchQuery]);

  // methods
  const isAllChecked = () => {
    // Filter out disabled children
    const enabledChildren = possibleChildren?.filter(
      (child) => !disabledChildren?.includes(child.value)
    );

    if (!enabledChildren?.length) {
      return {
        checked: false,
        indeterminate: false,
      };
    }

    const allChecked = enabledChildren.every((child) =>
      selectedChildren.includes(child.value)
    );
    const someChecked = enabledChildren.some((child) =>
      selectedChildren.includes(child.value)
    );

    return {
      checked: allChecked,
      indeterminate: !allChecked && someChecked,
    };
  };

  const isParentChecked = (
    parent: Entry
  ): { checked: boolean; indeterminate: boolean } => {
    if (disabledParents?.includes(parent.value)) {
      return {
        checked: false,
        indeterminate: false,
      };
    }

    // Filter out disabled children when checking parent state
    const enabledChildren = parent.children?.filter(
      (child) => !disabledChildren?.includes(child.value)
    );

    if (!enabledChildren?.length) {
      return {
        checked: false,
        indeterminate: false,
      };
    }

    const allChecked = enabledChildren.every((child) =>
      selectedChildren.includes(child.value)
    );
    const someChecked = enabledChildren.some((child) =>
      selectedChildren.includes(child.value)
    );

    return {
      checked: allChecked,
      indeterminate: !allChecked && someChecked,
    };
  };

  // handlers
  const onAllCheckedChange = (checked: boolean | string) => {
    const newSelection = checked
      ? possibleChildren
          .filter((c) => !disabledChildren?.includes(c.value))
          .map((child) => child.value)
      : [];
    setSelectedChildren(newSelection);
    onSelectedChange?.(newSelection);
  };

  const onParentCheckedChange = (parent: Entry, checked: boolean | string) => {
    if (!parent.children || disabledParents?.includes(parent.value)) return;

    const enabledChildren = parent.children.filter(
      (c) => !disabledChildren?.includes(c.value)
    );
    const enabledChildrenValues = enabledChildren.map((c) => c.value);

    setSelectedChildren((oldState) => {
      const newSelection = checked
        ? [...new Set([...oldState, ...enabledChildrenValues])]
        : oldState.filter((c) => {
            // When unchecking, only keep values that are not part of this parent's enabled children
            return !enabledChildrenValues.includes(c);
          });
      onSelectedChange?.(newSelection);
      return newSelection;
    });
  };

  const onParentClick = (region: Entry) => {
    setOpenedParents((oldState) => {
      return openedParents.includes(region.value)
        ? oldState.filter((r) => r != region.value)
        : [...new Set([...oldState, region.value])];
    });
  };

  const onChildCheckedChange = (checked: boolean | string, child: string) => {
    setSelectedChildren((oldState) => {
      const newSelection = checked
        ? [...new Set([...oldState, child])]
        : oldState.filter((c) => c != child);
      onSelectedChange?.(newSelection);
      return newSelection;
    });
  };

  return (
    <div className={className}>
      {/* Search Input */}
      {searchable && (
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
      )}
      {/* Empty State */}
      {searchQuery && filteredLevels?.length === 0 && (
        <p className="px-2 py-1.5 text-sm text-gray-500">
          {searchEmptyMessage}
        </p>
      )}

      {/* Select All Option */}
      {showSelectAllOption && !searchQuery && (
        <div className="flex w-full items-center justify-between">
          <label
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 px-2 py-1.5"
            )}
          >
            <Checkbox
              checked={isAllChecked().checked}
              indeterminate={isAllChecked().indeterminate}
              onChange={(e) => onAllCheckedChange(e.target.checked)}
            />
            <p className="font-semibold">{selectAllLabel}</p>
          </label>
        </div>
      )}

      {/* Parent and Child Checkboxes */}
      {filteredLevels?.map((parent) => (
        <div key={parent.value}>
          {/* Parent Checkbox */}
          <div className="flex w-full items-center justify-between">
            <label
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1.5",
                !disabledParents?.includes(parent.value) && "cursor-pointer"
              )}
            >
              <Checkbox
                className="peer"
                checked={isParentChecked(parent).checked}
                indeterminate={isParentChecked(parent).indeterminate}
                disabled={disabledParents?.includes(parent.value)}
                onChange={(e) =>
                  onParentCheckedChange(parent, e.target.checked)
                }
              />
              <p className="peer-disabled:opacity-32">{parent.label}</p>
            </label>
            {parent.children && (
              <button
                className="cursor-pointer hover:opacity-80"
                onClick={() => onParentClick(parent)}
              >
                <CaretDownIcon
                  className={`transition-transform duration-200 ${openedParents.includes(parent.value) ? "-rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {/* Child Checkboxes */}
          <div
            className={cn(
              "grid overflow-hidden transition-all duration-200",
              openedParents.includes(parent.value)
                ? "grid-rows-[1fr]"
                : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0">
              {parent.children?.map((child) => (
                <div key={child.value}>
                  <label
                    className={cn(
                      "flex w-full items-center gap-2 px-2 py-1.5 pl-8",
                      !(
                        disabledChildren?.includes(child.value) ||
                        disabledParents?.includes(parent.value)
                      ) && "cursor-pointer"
                    )}
                  >
                    <Checkbox
                      checked={selectedChildren.includes(child.value)}
                      disabled={
                        disabledChildren?.includes(child.value) ||
                        disabledParents?.includes(parent.value)
                      }
                      onChange={(e) =>
                        onChildCheckedChange(e.target.checked, child.value)
                      }
                      className="peer"
                    />
                    <p className="peer-disabled:opacity-32">{child.label}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CheckboxesHierarchy.displayName = "CheckboxesHierarchy";

export default CheckboxesHierarchy;
