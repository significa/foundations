"use client";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/foundations/ui/accordion/accordion";
import { cn } from "@/lib/utils";
import { FileText, Folder } from "@phosphor-icons/react";
import { useState, createContext, use } from "react";

const FileTreeContext = createContext<{
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
}>({
  selectedFile: null,
  setSelectedFile: () => {},
});

const FileTree = ({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath?: string;
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(
    initialPath || null
  );

  return (
    <FileTreeContext value={{ selectedFile, setSelectedFile }}>
      <div className="border-border relative flex h-[300px] rounded-xl border lg:h-[400px]">
        {children}
      </div>
    </FileTreeContext>
  );
};

const FileTreeNavigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-[180px] overflow-y-auto border-r p-2">
      {children}
    </div>
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
    <Accordion defaultOpen>
      <AccordionTrigger asChild>
        <Item>
          <Folder className="text-foreground-secondary" />
          <span>{name}</span>
        </Item>
      </AccordionTrigger>
      <AccordionContent>
        <FolderLevelContext value={{ path: [...path, name] }}>
          {children}
        </FolderLevelContext>
      </AccordionContent>
    </Accordion>
  );
};

const FileTreeFile = ({ name }: { name: string }) => {
  const { path } = use(FolderLevelContext);
  const fullPath = `${path.join("/")}/${name}`;

  const { selectedFile, setSelectedFile } = use(FileTreeContext);

  return (
    <Item
      isActive={selectedFile === fullPath}
      onClick={() => setSelectedFile(fullPath)}
    >
      <FileText className="text-foreground-secondary" />
      <span>{name}</span>
    </Item>
  );
};

const FileTreeContent = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const { selectedFile } = use(FileTreeContext);

  if (path !== selectedFile) return null;

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

interface ItemProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  isActive?: boolean;
}

const Item = ({ children, ref, className, isActive, ...props }: ItemProps) => {
  const { path } = use(FolderLevelContext);

  return (
    <button
      ref={ref}
      className={cn(
        "font-mono text-sm",
        "hover:bg-foreground/5 focus-visible:bg-foreground/10 mt-0.5 flex w-full cursor-pointer items-center gap-1 rounded-md px-2 py-1 pl-[calc(var(--level)*var(--spacing)*2)] outline-none focus-visible:ring-transparent",
        isActive && "bg-foreground/5",
        className
      )}
      style={{ "--level": path.length + 1 }}
      {...props}
    >
      {children}
    </button>
  );
};

export {
  FileTree,
  FileTreeNavigation,
  FileTreeFolder,
  FileTreeFile,
  FileTreeContent,
};
