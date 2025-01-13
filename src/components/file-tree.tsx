"use client";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/foundations/ui/accordion/accordion";
import { cn } from "@/lib/utils";
import { FileText, Folder } from "@phosphor-icons/react";
import { useState, createContext, use, useCallback, useEffect } from "react";

const FileTreeContext = createContext<{
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  registerFile: (path: string) => () => void;
}>({
  selectedFile: null,
  setSelectedFile: () => {},
  registerFile: () => () => {},
});

const FileTree = ({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath?: string;
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(
    initialPath || null
  );

  const registerFile = useCallback((path: string) => {
    setFiles((prev) => {
      if (prev.includes(path)) throw new Error("File already registered");

      return [...prev, path];
    });

    // Unregister
    return () => {
      setFiles((prev) => prev.filter((p) => p !== path));
    };
  }, []);

  return (
    <FileTreeContext value={{ selectedFile, setSelectedFile, registerFile }}>
      <div className="border-border relative flex h-[300px] rounded-xl border lg:h-[400px]">
        <div className="h-full w-[180px] overflow-y-auto border-r p-2">
          <FileNavigation files={files} />
        </div>
        {children}
      </div>
    </FileTreeContext>
  );
};

const FolderLevelContext = createContext<{ path: string[] }>({ path: [] });

const FileTreeFolder = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const { path } = use(FolderLevelContext);

  return (
    <FolderLevelContext value={{ path: [...path, name] }}>
      {children}
    </FolderLevelContext>
  );
};

const FileTreeFile = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const { path } = use(FolderLevelContext);
  const fullPath = [...path, name].join("/");

  const { selectedFile, registerFile } = use(FileTreeContext);

  useEffect(() => {
    const unregister = registerFile(fullPath);

    return unregister;
  }, [registerFile, fullPath]);

  if (selectedFile !== fullPath) return null;

  return (
    <div
      className={cn(
        "h-full flex-1 overflow-auto text-sm",
        "bg-foreground/2 rounded-r-xl",
        "[&_pre[data-language]]:overflow-visible [&_pre[data-language]]:rounded-none [&_pre[data-language]]:border-transparent [&_pre[data-language]]:bg-transparent",
        "[&_div[data-code-block]]:static"
      )}
    >
      {children}
    </div>
  );
};

type FileTreeNode = {
  [key: string]: FileTreeNode | null;
};

// Helper function to build a tree from file paths
const buildTree = (paths: string[]): FileTreeNode => {
  const root: FileTreeNode = {};

  paths.forEach((path) => {
    const parts = path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      current = current[part] as FileTreeNode;
    });
  });

  return root;
};

interface FileNavigationProps {
  files: string[];
}

const FileNavigation = ({ files }: FileNavigationProps) => {
  const fileTree = buildTree(files);

  return (
    <div>
      {Object.entries(fileTree).map(([key, value]) => (
        <FileNavigationItem key={key} name={key} node={value} path={[]} />
      ))}
    </div>
  );
};

interface FileNavigationItemProps {
  name: string;
  node: FileTreeNode | null;
  path: string[];
}

const FileNavigationItem = ({ name, node, path }: FileNavigationItemProps) => {
  const { selectedFile, setSelectedFile } = use(FileTreeContext);
  const currentPath = [...path, name];
  const fullPath = currentPath.join("/");

  // File item
  if (node === null) {
    return (
      <Item
        key={fullPath}
        level={path.length + 1}
        isActive={selectedFile === fullPath}
        onClick={() => setSelectedFile(fullPath)}
      >
        <FileText className="text-foreground-secondary" />
        <span>{name}</span>
      </Item>
    );
  }

  return (
    <Accordion key={fullPath} defaultOpen>
      <AccordionTrigger asChild>
        <Item level={path.length + 1}>
          <Folder className="text-foreground-secondary" />
          <span>{name}</span>
        </Item>
      </AccordionTrigger>
      <AccordionContent>
        {Object.entries(node).map(([childKey, childNode]) => (
          <FileNavigationItem
            key={childKey}
            name={childKey}
            node={childNode}
            path={currentPath}
          />
        ))}
      </AccordionContent>
    </Accordion>
  );
};

interface ItemProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  isActive?: boolean;
  level?: number;
}

const Item = ({
  children,
  ref,
  className,
  isActive,
  level = 0,
  ...props
}: ItemProps) => {
  return (
    <button
      ref={ref}
      className={cn(
        "font-mono text-sm",
        "hover:bg-foreground/5 focus-visible:bg-foreground/10 mt-0.5 flex w-full cursor-pointer items-center gap-1 rounded-md px-2 py-1 pl-[calc(var(--level)*var(--spacing)*2)] outline-none focus-visible:ring-transparent",
        isActive && "bg-foreground/5",
        className
      )}
      style={{ "--level": level }}
      {...props}
    >
      {children}
    </button>
  );
};

export { FileTree, FileTreeFolder, FileTreeFile };
