"use client";

import { useCallback, useMemo, useState } from "react";
import {
  HierarchicalItem,
  HierarchicalSelectionState,
  SelectionStatus,
  flattenHierarchicalData,
  getEnabledChildIds,
  getParentSelectionStatus,
  getSelectAllStatus,
} from "./hierarchical-data";

export interface UseHierarchicalSelectionOptions {
  /** Initial selected item IDs */
  defaultSelected?: string[];
  /** Initial opened parent IDs */
  defaultOpened?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback when opened parents change */
  onOpenChange?: (openedIds: string[]) => void;
}

export interface UseHierarchicalSelectionResult {
  /** Current selected item IDs as a Set for efficient lookup */
  selectedIds: Set<string>;
  /** Current opened parent IDs as a Set for efficient lookup */
  openParentIds: Set<string>;
  /** Current selected item IDs as an array */
  selectedArray: string[];
  /** Current opened parent IDs as an array */
  openedArray: string[];
  
  /** Toggle selection of a single item */
  toggleItem: (itemId: string) => void;
  /** Select/deselect a parent and all its enabled children */
  toggleParent: (parentItem: HierarchicalItem, checked: boolean) => void;
  /** Select/deselect all enabled items */
  toggleAll: (items: HierarchicalItem[], checked: boolean) => void;
  /** Toggle the opened state of a parent */
  toggleParentOpen: (parentId: string) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Select specific items */
  selectItems: (itemIds: string[]) => void;
  
  /** Get selection status for a parent item */
  getParentStatus: (parentItem: HierarchicalItem) => SelectionStatus;
  /** Get selection status for "select all" */
  getSelectAllStatus: (items: HierarchicalItem[]) => SelectionStatus;
  /** Check if an item is selected */
  isSelected: (itemId: string) => boolean;
  /** Check if a parent is opened */
  isParentOpen: (parentId: string) => boolean;
}

export function useHierarchicalSelection(
  options: UseHierarchicalSelectionOptions = {}
): UseHierarchicalSelectionResult {
  const {
    defaultSelected = [],
    defaultOpened = [],
    onSelectionChange,
    onOpenChange,
  } = options;

  // Internal state
  const [state, setState] = useState<HierarchicalSelectionState>({
    selectedIds: new Set(defaultSelected),
    openParentIds: new Set(defaultOpened),
  });

  // Derived values
  const selectedArray = useMemo(() => Array.from(state.selectedIds), [state.selectedIds]);
  const openedArray = useMemo(() => Array.from(state.openParentIds), [state.openParentIds]);

  // Update callbacks when arrays change
  const notifySelectionChange = useCallback((newSelectedIds: Set<string>) => {
    const newArray = Array.from(newSelectedIds);
    onSelectionChange?.(newArray);
  }, [onSelectionChange]);

  const notifyOpenChange = useCallback((newOpenIds: Set<string>) => {
    const newArray = Array.from(newOpenIds);
    onOpenChange?.(newArray);
  }, [onOpenChange]);

  // Selection methods
  const toggleItem = useCallback((itemId: string) => {
    setState(prev => {
      const newSelectedIds = new Set(prev.selectedIds);
      
      if (newSelectedIds.has(itemId)) {
        newSelectedIds.delete(itemId);
      } else {
        newSelectedIds.add(itemId);
      }
      
      notifySelectionChange(newSelectedIds);
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
      };
    });
  }, [notifySelectionChange]);

  const toggleParent = useCallback((parentItem: HierarchicalItem, checked: boolean) => {
    if (parentItem.disabled) return;
    
    setState(prev => {
      const newSelectedIds = new Set(prev.selectedIds);
      const enabledChildIds = getEnabledChildIds(parentItem);
      
      if (checked) {
        enabledChildIds.forEach(id => newSelectedIds.add(id));
      } else {
        enabledChildIds.forEach(id => newSelectedIds.delete(id));
      }
      
      notifySelectionChange(newSelectedIds);
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
      };
    });
  }, [notifySelectionChange]);

  const toggleAll = useCallback((items: HierarchicalItem[], checked: boolean) => {
    setState(prev => {
      const allEnabledIds = flattenHierarchicalData(items)
        .filter(item => !item.disabled)
        .map(item => item.id);
      
      let newSelectedIds: Set<string>;
      
      if (checked) {
        newSelectedIds = new Set([...prev.selectedIds, ...allEnabledIds]);
      } else {
        newSelectedIds = new Set(
          Array.from(prev.selectedIds).filter(id => !allEnabledIds.includes(id))
        );
      }
      
      notifySelectionChange(newSelectedIds);
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
      };
    });
  }, [notifySelectionChange]);

  const toggleParentOpen = useCallback((parentId: string) => {
    setState(prev => {
      const newOpenIds = new Set(prev.openParentIds);
      
      if (newOpenIds.has(parentId)) {
        newOpenIds.delete(parentId);
      } else {
        newOpenIds.add(parentId);
      }
      
      notifyOpenChange(newOpenIds);
      
      return {
        ...prev,
        openParentIds: newOpenIds,
      };
    });
  }, [notifyOpenChange]);

  const clearSelection = useCallback(() => {
    setState(prev => {
      const newSelectedIds = new Set<string>();
      notifySelectionChange(newSelectedIds);
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
      };
    });
  }, [notifySelectionChange]);

  const selectItems = useCallback((itemIds: string[]) => {
    setState(prev => {
      const newSelectedIds = new Set(itemIds);
      notifySelectionChange(newSelectedIds);
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
      };
    });
  }, [notifySelectionChange]);

  // Status methods
  const getParentStatus = useCallback((parentItem: HierarchicalItem): SelectionStatus => {
    return getParentSelectionStatus(parentItem, state.selectedIds);
  }, [state.selectedIds]);

  const getSelectAllStatusResult = useCallback((items: HierarchicalItem[]): SelectionStatus => {
    return getSelectAllStatus(items, state.selectedIds);
  }, [state.selectedIds]);

  const isSelected = useCallback((itemId: string): boolean => {
    return state.selectedIds.has(itemId);
  }, [state.selectedIds]);

  const isParentOpen = useCallback((parentId: string): boolean => {
    return state.openParentIds.has(parentId);
  }, [state.openParentIds]);

  return {
    selectedIds: state.selectedIds,
    openParentIds: state.openParentIds,
    selectedArray,
    openedArray,
    
    toggleItem,
    toggleParent,
    toggleAll,
    toggleParentOpen,
    clearSelection,
    selectItems,
    
    getParentStatus,
    getSelectAllStatus: getSelectAllStatusResult,
    isSelected,
    isParentOpen,
  };
}