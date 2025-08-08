export interface HierarchicalItem {
  id: string;
  label: string;
  children?: HierarchicalItem[];
  disabled?: boolean;
}

export interface HierarchicalSelectionState {
  selectedIds: Set<string>;
  openParentIds: Set<string>;
}

export interface SelectionStatus {
  checked: boolean;
  indeterminate: boolean;
}

/**
 * Flattens a hierarchical data structure to get all items
 */
export function flattenHierarchicalData(
  items: HierarchicalItem[]
): HierarchicalItem[] {
  return items.reduce<HierarchicalItem[]>((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenHierarchicalData(item.children));
    }
    return acc;
  }, []);
}

/**
 * Gets all child IDs for a given parent item
 */
export function getChildIds(item: HierarchicalItem): string[] {
  if (!item.children) return [];
  return flattenHierarchicalData(item.children).map((child) => child.id);
}

/**
 * Gets all enabled child IDs for a given parent item
 */
export function getEnabledChildIds(item: HierarchicalItem): string[] {
  if (!item.children) return [];
  return flattenHierarchicalData(item.children)
    .filter((child) => !child.disabled)
    .map((child) => child.id);
}

/**
 * Determines the selection status of a parent item based on its children
 */
export function getParentSelectionStatus(
  parentItem: HierarchicalItem,
  selectedIds: Set<string>
): SelectionStatus {
  if (parentItem.disabled) {
    return { checked: false, indeterminate: false };
  }

  const enabledChildIds = getEnabledChildIds(parentItem);

  if (enabledChildIds.length === 0) {
    return { checked: false, indeterminate: false };
  }

  const selectedChildCount = enabledChildIds.filter((id) =>
    selectedIds.has(id)
  ).length;

  if (selectedChildCount === 0) {
    return { checked: false, indeterminate: false };
  } else if (selectedChildCount === enabledChildIds.length) {
    return { checked: true, indeterminate: false };
  } else {
    return { checked: false, indeterminate: true };
  }
}

/**
 * Gets the selection status for "select all" functionality
 */
export function getSelectAllStatus(
  items: HierarchicalItem[],
  selectedIds: Set<string>
): SelectionStatus {
  const allEnabledIds = flattenHierarchicalData(items)
    .filter((item) => !item.disabled)
    .map((item) => item.id);

  if (allEnabledIds.length === 0) {
    return { checked: false, indeterminate: false };
  }

  const selectedEnabledCount = allEnabledIds.filter((id) =>
    selectedIds.has(id)
  ).length;

  if (selectedEnabledCount === 0) {
    return { checked: false, indeterminate: false };
  } else if (selectedEnabledCount === allEnabledIds.length) {
    return { checked: true, indeterminate: false };
  } else {
    return { checked: false, indeterminate: true };
  }
}

/**
 * Filters hierarchical data based on a search query
 */
export function filterHierarchicalData(
  items: HierarchicalItem[],
  searchQuery: string
): HierarchicalItem[] {
  if (!searchQuery.trim()) return items;

  const query = searchQuery.toLowerCase();

  return items
    .map((item) => {
      const matchingChildren = item.children?.filter((child) =>
        child.label.toLowerCase().includes(query)
      );

      if (item.label.toLowerCase().includes(query)) {
        return item;
      } else if (matchingChildren?.length) {
        return { ...item, children: matchingChildren };
      }
      return null;
    })
    .filter(Boolean) as HierarchicalItem[];
}
