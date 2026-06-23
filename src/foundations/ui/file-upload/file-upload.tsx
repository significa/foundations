import {
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FilePdfIcon,
  FileVideoIcon,
  ImageIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { Progress } from "@/foundations/ui/progress/progress";
import { cn } from "@/lib/utils/classnames";

type FileUploadStatus = "idle" | "uploading" | "success" | "error";

interface FileEntry {
  id: string;
  file: File;
}

interface RejectedFileEntry extends FileEntry {
  error: string;
}

interface FileUploadContextValue {
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept?: string;
  multiple: boolean;
  maxFiles?: number;
  disabled?: boolean;
  files: FileEntry[];
  rejected: RejectedFileEntry[];
  isDragging: boolean;
  isInvalid: boolean;
  // Internal: only Dropzone should call these. Kept on the public context for
  // simplicity rather than splitting into two contexts.
  setIsDragging: (v: boolean) => void;
  setIsInvalid: (v: boolean) => void;
  open: () => void;
  add: (files: FileList | File[]) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

const useFileUploadContext = () => {
  const ctx = use(FileUploadContext);
  if (!ctx) {
    throw new Error("FileUpload components must be used within a FileUpload root");
  }
  return ctx;
};

const matchesAccept = (file: File, accept: string): boolean => {
  const tokens = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
};

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${i === 0 ? value : value.toFixed(value >= 100 ? 0 : 1)} ${units[i]}`;
};

const getFileIcon = (file: File) => {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return FileVideoIcon;
  if (type.startsWith("audio/")) return FileAudioIcon;
  if (type === "application/pdf") return FilePdfIcon;
  if (
    type === "application/zip" ||
    type === "application/x-rar-compressed" ||
    type === "application/x-7z-compressed" ||
    type === "application/x-tar" ||
    type === "application/gzip"
  ) {
    return FileArchiveIcon;
  }
  return FileIcon;
};

interface FileUploadProps extends Omit<React.ComponentPropsWithRef<"div">, "onChange"> {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  validate?: (file: File) => string | undefined;
  onFilesChange?: (files: File[]) => void;
  /** Called with newly accepted entries when files are added. Use this to kick
   * off side effects (uploads, etc.) — running them off `onFilesChange` would
   * also fire on remove/clear. */
  onAdd?: (entries: FileEntry[]) => void;
  onReject?: (rejections: RejectedFileEntry[]) => void;
}

const FileUpload = ({
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  minSize,
  disabled,
  required,
  name,
  validate,
  onFilesChange,
  onAdd,
  onReject,
  className,
  children,
  ...props
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounterRef = useRef(0);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedFileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const validateFile = useCallback(
    (file: File): string | undefined => {
      if (accept && !matchesAccept(file, accept)) return "invalid-type";
      if (maxSize !== undefined && file.size > maxSize) return "too-large";
      if (minSize !== undefined && file.size < minSize) return "too-small";
      return validate?.(file);
    },
    [accept, maxSize, minSize, validate],
  );

  const open = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const add = useCallback(
    (incoming: FileList | File[]) => {
      const incomingArr = Array.from(incoming);
      const accepted: FileEntry[] = [];
      const newRejected: RejectedFileEntry[] = [];

      const existingCount = multiple ? files.length : 0;

      for (const file of incomingArr) {
        const error = validateFile(file);
        if (error) {
          newRejected.push({
            id: `fu-${++idCounterRef.current}`,
            file,
            error,
          });
          continue;
        }

        if (maxFiles !== undefined && existingCount + accepted.length >= maxFiles) {
          newRejected.push({
            id: `fu-${++idCounterRef.current}`,
            file,
            error: "too-many",
          });
          continue;
        }

        accepted.push({ id: `fu-${++idCounterRef.current}`, file });

        if (!multiple && accepted.length === 1) break;
      }

      if (accepted.length > 0) {
        const next = multiple ? [...files, ...accepted] : accepted;
        setFiles(next);
        onFilesChange?.(next.map((e) => e.file));
        onAdd?.(accepted);
      }

      setRejected(newRejected);
      if (newRejected.length > 0) onReject?.(newRejected);
    },
    [files, multiple, maxFiles, validateFile, onFilesChange, onAdd, onReject],
  );

  const remove = useCallback(
    (id: string) => {
      const next = files.filter((e) => e.id !== id);
      setFiles(next);
      onFilesChange?.(next.map((e) => e.file));
    },
    [files, onFilesChange],
  );

  const clear = useCallback(() => {
    setFiles([]);
    setRejected([]);
    onFilesChange?.([]);
  }, [onFilesChange]);

  const ctx = useMemo<FileUploadContextValue>(
    () => ({
      inputRef,
      accept,
      multiple,
      maxFiles,
      disabled,
      files,
      rejected,
      isDragging,
      isInvalid,
      setIsDragging,
      setIsInvalid,
      open,
      add,
      remove,
      clear,
    }),
    [
      accept,
      multiple,
      maxFiles,
      disabled,
      files,
      rejected,
      isDragging,
      isInvalid,
      open,
      add,
      remove,
      clear,
    ],
  );

  return (
    <FileUploadContext value={ctx}>
      <div className={cn("relative", className)} {...props}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          name={name}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              add(e.target.files);
            }
            e.target.value = "";
          }}
        />
        {children}
      </div>
    </FileUploadContext>
  );
};

interface FileUploadDropzoneProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const FileUploadDropzone = ({
  asChild,
  className,
  children,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  ...props
}: FileUploadDropzoneProps) => {
  const { open, add, disabled, isDragging, isInvalid, accept, setIsDragging, setIsInvalid } =
    useFileUploadContext();
  const counterRef = useRef(0);

  // Best-effort drag preview: dataTransfer.items expose `kind` + `type` (no
  // file name yet), so we can short-circuit `data-invalid` on type-mismatched
  // drags. Fails safe — if items aren't available we just stay neutral.
  const willAccept = (e: React.DragEvent) => {
    if (!accept) return true;
    const items = e.dataTransfer?.items;
    if (!items || items.length === 0) return true;
    return Array.from(items).some((item) => {
      if (item.kind !== "file") return false;
      const type = item.type.toLowerCase();
      const tokens = accept
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      if (tokens.length === 0) return true;
      return tokens.some((token) => {
        if (token.startsWith(".")) return false;
        if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
        return type === token;
      });
    });
  };

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-dragging={isDragging || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (disabled) return;
        open();
      }}
      onDragEnter={(e) => {
        onDragEnter?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        counterRef.current++;
        if (counterRef.current === 1) {
          setIsDragging(true);
          setIsInvalid(!willAccept(e));
        }
      }}
      onDragLeave={(e) => {
        onDragLeave?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        counterRef.current = Math.max(0, counterRef.current - 1);
        if (counterRef.current === 0) {
          setIsDragging(false);
          setIsInvalid(false);
        }
      }}
      onDragOver={(e) => {
        onDragOver?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
      }}
      onDrop={(e) => {
        onDrop?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        counterRef.current = 0;
        setIsDragging(false);
        setIsInvalid(false);
        if (disabled) return;
        if (e.dataTransfer.files.length > 0) {
          add(e.dataTransfer.files);
        }
      }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border border-dashed p-6 text-center transition-colors",
        "cursor-pointer hover:bg-foreground/2",
        "data-dragging:border-accent data-dragging:bg-accent/5",
        "data-invalid:border-error data-invalid:bg-error/5",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

interface FileUploadTriggerProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const FileUploadTrigger = ({ asChild, onClick, children, ...props }: FileUploadTriggerProps) => {
  const { open, disabled } = useFileUploadContext();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type="button"
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Stop the click from bubbling to a parent Dropzone, which would
        // double-open the file picker.
        e.stopPropagation();
        open();
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};

interface FileUploadListProps extends Omit<React.ComponentPropsWithRef<"ul">, "children"> {
  children: (files: FileEntry[]) => React.ReactNode;
  emptyFallback?: React.ReactNode;
}

const FileUploadList = ({ className, children, emptyFallback, ...props }: FileUploadListProps) => {
  const { files } = useFileUploadContext();

  if (files.length === 0 && emptyFallback === undefined) return null;

  return (
    <ul className={cn("flex flex-col gap-2", className)} {...props}>
      {files.length === 0 ? emptyFallback : children(files)}
    </ul>
  );
};

interface ItemContextValue {
  entry: FileEntry;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
}

const ItemContext = createContext<ItemContextValue | null>(null);

const useItemContext = () => {
  const ctx = use(ItemContext);
  if (!ctx) {
    throw new Error("FileUpload.Item subcomponents must be used within a FileUpload.Item");
  }
  return ctx;
};

interface FileUploadItemProps extends React.ComponentPropsWithRef<"li"> {
  entry: FileEntry;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
}

const FileUploadItem = ({
  entry,
  status,
  progress,
  error,
  className,
  children,
  ...props
}: FileUploadItemProps) => {
  const value = useMemo(
    () => ({ entry, status, progress, error }),
    [entry, status, progress, error],
  );

  return (
    <ItemContext value={value}>
      <li
        data-status={status}
        data-error={error ? true : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-background p-2",
          "data-error:border-error/50",
          className,
        )}
        {...props}
      >
        {children}
      </li>
    </ItemContext>
  );
};

interface FileUploadItemPreviewProps extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
  iconClassName?: string;
}

const FileUploadItemPreview = ({
  className,
  iconClassName,
  ...props
}: FileUploadItemPreviewProps) => {
  const { entry } = useItemContext();

  const url = useMemo(() => {
    if (!entry.file.type.startsWith("image/")) return null;
    if (typeof URL?.createObjectURL !== "function") return null;
    return URL.createObjectURL(entry.file);
  }, [entry.file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const Icon = getFileIcon(entry.file);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground/5 text-foreground/70",
        className,
      )}
      {...props}
    >
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <Icon className={cn("size-5", iconClassName)} />
      )}
    </div>
  );
};

const FileUploadItemName = ({ className, ...props }: React.ComponentPropsWithRef<"span">) => {
  const { entry } = useItemContext();
  return (
    <span className={cn("flex-1 truncate text-sm", className)} title={entry.file.name} {...props}>
      {entry.file.name}
    </span>
  );
};

const FileUploadItemSize = ({ className, ...props }: React.ComponentPropsWithRef<"span">) => {
  const { entry } = useItemContext();
  return (
    <span className={cn("shrink-0 text-foreground-secondary text-xs", className)} {...props}>
      {formatBytes(entry.file.size)}
    </span>
  );
};

interface FileUploadItemProgressProps extends React.ComponentPropsWithRef<"div"> {
  showWhenIdle?: boolean;
}

const FileUploadItemProgress = ({
  className,
  showWhenIdle = false,
  ...props
}: FileUploadItemProgressProps) => {
  const { progress, status } = useItemContext();

  if (progress === undefined && !showWhenIdle) return null;
  if (status === "success" && !showWhenIdle) return null;

  return (
    <Progress
      value={progress ?? 0}
      size="sm"
      className={cn("w-24", status === "error" && "text-error", className)}
      {...props}
    />
  );
};

interface FileUploadItemRemoveProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const FileUploadItemRemove = ({
  asChild,
  onClick,
  className,
  children,
  ...props
}: FileUploadItemRemoveProps) => {
  const { remove } = useFileUploadContext();
  const { entry } = useItemContext();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type="button"
      aria-label={`Remove ${entry.file.name}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        remove(entry.id);
      }}
      className={cn(
        !asChild &&
          "focus-visible:ring-(length:--ring-width) flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-secondary outline-none ring-ring transition-colors hover:bg-foreground/5 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <XIcon className="size-4" />}
    </Comp>
  );
};

const CompoundFileUpload = Object.assign(FileUpload, {
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  List: FileUploadList,
  Item: FileUploadItem,
  ItemPreview: FileUploadItemPreview,
  ItemName: FileUploadItemName,
  ItemSize: FileUploadItemSize,
  ItemProgress: FileUploadItemProgress,
  ItemRemove: FileUploadItemRemove,
});

export type { FileEntry, FileUploadStatus, RejectedFileEntry };
export { CompoundFileUpload as FileUpload, formatBytes, useFileUploadContext };
