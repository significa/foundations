import { Skeleton } from "../skeleton";

export default function SkeletonExample() {
  return (
    <div className="flex items-center gap-1">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
