import {
  UploadSimpleIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

import {
  FileUpload,
  formatBytes,
  type RejectedFileEntry,
} from '@/foundations/ui/file-upload/file-upload';

const ERROR_LABEL: Record<string, string> = {
  'invalid-type': 'Wrong file type',
  'too-large': 'File too large',
  'too-small': 'File too small',
  'too-many': 'Too many files',
};

const MAX_SIZE = 1_000_000;

export default function FileUploadErrorsPreview() {
  const [errors, setErrors] = useState<RejectedFileEntry[]>([]);

  return (
    <FileUpload
      className="w-full max-w-sm"
      accept="image/png,image/jpeg"
      maxSize={MAX_SIZE}
      maxFiles={3}
      onReject={setErrors}
      onFilesChange={() => setErrors([])}
    >
      <FileUpload.Dropzone>
        <UploadSimpleIcon className="size-6 text-foreground-secondary" />
        <p className="font-medium text-sm">PNG or JPG only</p>
        <p className="text-foreground-secondary text-xs">
          Up to 3 files, {formatBytes(MAX_SIZE)} each
        </p>
      </FileUpload.Dropzone>

      {errors.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {errors.map((rejection) => (
            <li
              key={rejection.id}
              className="flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-error text-sm"
            >
              <WarningCircleIcon className="size-4 shrink-0" />
              <span className="flex-1 truncate">{rejection.file.name}</span>
              <span className="shrink-0 text-xs">
                {ERROR_LABEL[rejection.error] ?? rejection.error}
              </span>
            </li>
          ))}
        </ul>
      )}

      <FileUpload.List className="mt-3">
        {(files) =>
          files.map((entry) => (
            <FileUpload.Item key={entry.id} entry={entry}>
              <FileUpload.ItemPreview />
              <FileUpload.ItemName />
              <FileUpload.ItemSize />
              <FileUpload.ItemRemove />
            </FileUpload.Item>
          ))
        }
      </FileUpload.List>
    </FileUpload>
  );
}
