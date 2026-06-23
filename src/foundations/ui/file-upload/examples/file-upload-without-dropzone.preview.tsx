import { CameraIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";

import { Avatar } from "@/foundations/ui/avatar/avatar";
import { Button } from "@/foundations/ui/button/button";
import { FileUpload } from "@/foundations/ui/file-upload/file-upload";

export default function FileUploadWithoutDropzonePreview() {
  const [file, setFile] = useState<File | null>(null);

  const url = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <FileUpload
      multiple={false}
      accept="image/*"
      maxSize={5_000_000}
      onFilesChange={(files) => setFile(files[0] ?? null)}
    >
      <div className="flex items-center gap-4">
        <Avatar size="2xl">
          {url ? <Avatar.Image src={url} /> : <CameraIcon className="size-6" />}
        </Avatar>
        <div className="flex flex-col gap-1">
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm">
              {file ? "Change avatar" : "Upload avatar"}
            </Button>
          </FileUpload.Trigger>
          <p className="text-foreground-secondary text-xs">PNG or JPG, 5 MB max</p>
        </div>
      </div>
    </FileUpload>
  );
}
