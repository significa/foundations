"use client";

import { FileText, Folder } from "@phosphor-icons/react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/foundations/ui/accordion/accordion";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type SourceCodeTreeFile = {
  path: string;
  code?: string;
  language?: string;
};

type SourceCodeTreeFolder = {
  name: string;
  children: SourceCodeTreeItem[];
};

type SourceCodeTreeItem = SourceCodeTreeFolder | SourceCodeTreeFile;

interface SourceCodeTreeProps {
  items: SourceCodeTreeItem[];
}

const findFirstSelectableItem = (
  items: SourceCodeTreeItem[]
): SourceCodeTreeFile | null => {
  for (const item of items) {
    if ("children" in item) {
      const found = findFirstSelectableItem(item.children);
      if (found) return found;
    } else {
      return item;
    }
  }
  return null;
};

export const SourceCodeTreeClient = ({ items }: SourceCodeTreeProps) => {
  const [selectedItem, setSelectedItem] = useState<SourceCodeTreeFile | null>(
    findFirstSelectableItem(items)
  );

  return (
    <div className="flex h-[400px] border border-border rounded-xl relative">
      <nav className="w-[180px] h-full overflow-y-auto border-r p-2">
        {items.map((item, index) => (
          <FileItem
            key={index}
            item={item}
            onSelect={setSelectedItem}
            selectedPath={selectedItem?.path || null}
          />
        ))}
      </nav>
      <div
        className={cn(
          "flex-1 h-full overflow-y-auto text-sm",
          "rounded-r-xl bg-foreground/2",
          "[&_pre[data-language]]:border-transparent [&_pre[data-language]]:rounded-none [&_pre[data-language]]:bg-transparent [&_pre[data-language]]:overflow-x-visible"
        )}
      >
        {selectedItem ? (
          <div dangerouslySetInnerHTML={{ __html: selectedItem.code || "" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-foreground-secondary">
            <span>Select a file to view the source code</span>
          </div>
        )}
      </div>
      {selectedItem?.code && (
        <CopyButton
          content={selectedItem.code}
          className="opacity-80 absolute top-2 right-2"
        />
      )}
    </div>
  );
};

const FileItem = ({
  item,
  onSelect,
  level = 0,
  selectedPath,
}: {
  item: SourceCodeTreeItem;
  onSelect: (item: SourceCodeTreeFile) => void;
  level?: number;
  selectedPath: string | null;
}) => {
  if ("children" in item) {
    return (
      <Accordion defaultOpen className="font-mono text-sm">
        <AccordionTrigger asChild>
          <Item level={level}>
            <Folder className="text-foreground-secondary" />
            <span>{item.name}</span>
          </Item>
        </AccordionTrigger>
        <AccordionContent>
          {item.children.map((child, index) => (
            <FileItem
              key={index}
              item={child}
              onSelect={onSelect}
              level={level + 1}
              selectedPath={selectedPath}
            />
          ))}
        </AccordionContent>
      </Accordion>
    );
  }

  const name = item.path.split("/").pop();

  return (
    <Item
      level={level}
      onClick={() => onSelect(item)}
      isActive={selectedPath === item.path}
    >
      <FileText className="text-foreground-secondary" />
      <span>{name}</span>
    </Item>
  );
};

interface ItemProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  level: number;
  isActive?: boolean;
}

const Item = ({
  children,
  level,
  isActive,
  ref,
  className,
  ...props
}: ItemProps) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-1 w-full rounded-md px-2 py-1 hover:bg-foreground/5 pl-[calc(var(--level)*var(--spacing)*2)] cursor-pointer outline-none focus-visible:bg-foreground/10 focus-visible:ring-transparent mt-0.5",
        isActive && "bg-foreground/5",
        className
      )}
      style={{ "--level": level + 1 }}
      {...props}
    >
      {children}
    </button>
  );
};
