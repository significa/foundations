import { UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr';

import { FileUpload } from '@/foundations/ui/file-upload/file-upload';

export default function FileUploadPreview() {
  return (
    <FileUpload className="w-full max-w-sm" maxFiles={5} maxSize={5_000_000}>
      <FileUpload.Dropzone>
        <UploadSimpleIcon className="size-6 text-foreground-secondary" />
        <div className="text-sm">
          <span className="font-medium">Drop files here</span>{' '}
          <span className="text-foreground-secondary">or</span>{' '}
          <FileUpload.Trigger className="cursor-pointer font-medium text-accent underline-offset-2 hover:underline">
            browse
          </FileUpload.Trigger>
        </div>
        <p className="text-foreground-secondary text-xs">
          Up to 5 files, 5 MB each
        </p>
      </FileUpload.Dropzone>

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
