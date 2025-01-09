import { cn } from "@/lib/utils";

export const ComponentPreview = ({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) => {
  return (
    <iframe
      className={cn(
        "w-full h-[400px] rounded-xl border border-border",
        className
      )}
      src={`/preview/${slug}`}
    />
  );
};
