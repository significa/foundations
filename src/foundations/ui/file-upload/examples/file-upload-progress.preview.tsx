import { UploadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import {
  type FileEntry,
  FileUpload,
  type FileUploadStatus,
} from "@/foundations/ui/file-upload/file-upload";

interface UploadState {
  status: FileUploadStatus;
  progress: number;
}

/**
 * Real-world replacement for `simulateUpload`:
 *
 *   const xhr = new XMLHttpRequest();
 *   xhr.upload.addEventListener('progress', (e) => {
 *     if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
 *   });
 *   xhr.addEventListener('load', () => onDone(xhr.status === 200));
 *   xhr.open('POST', '/api/upload');
 *   xhr.send(formData);
 *
 * `fetch` does not expose upload progress reliably across browsers — XHR is
 * still the right tool here.
 */
const simulateUpload = (
  onProgress: (value: number) => void,
  onDone: (success: boolean) => void,
) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      onProgress(100);
      clearInterval(interval);
      onDone(Math.random() > 0.15);
      return;
    }
    onProgress(progress);
  }, 200);
};

export default function FileUploadProgressPreview() {
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});

  const startUploads = (entries: FileEntry[]) => {
    for (const entry of entries) {
      setUploads((prev) => ({
        ...prev,
        [entry.id]: { status: "uploading", progress: 0 },
      }));

      simulateUpload(
        (progress) => {
          setUploads((prev) => ({
            ...prev,
            [entry.id]: { status: "uploading", progress },
          }));
        },
        (success) => {
          setUploads((prev) => ({
            ...prev,
            [entry.id]: {
              status: success ? "success" : "error",
              progress: 100,
            },
          }));
        },
      );
    }
  };

  return (
    <FileUpload className="w-full max-w-sm" maxFiles={5} onAdd={startUploads}>
      <FileUpload.Dropzone>
        <UploadSimpleIcon className="size-6 text-foreground-secondary" />
        <p className="text-sm">
          <span className="font-medium">Drop or browse</span>
        </p>
      </FileUpload.Dropzone>

      <FileUpload.List className="mt-3">
        {(files) =>
          files.map((entry) => {
            const state = uploads[entry.id];
            return (
              <FileUpload.Item
                key={entry.id}
                entry={entry}
                status={state?.status}
                progress={state?.progress}
                error={state?.status === "error" ? "Upload failed" : undefined}
              >
                <FileUpload.ItemPreview />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <FileUpload.ItemName />
                  <FileUpload.ItemProgress className="w-full" />
                </div>
                <FileUpload.ItemRemove />
              </FileUpload.Item>
            );
          })
        }
      </FileUpload.List>
    </FileUpload>
  );
}
