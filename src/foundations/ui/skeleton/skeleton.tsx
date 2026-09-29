import { cn } from "@/lib/utils/classnames";

const Skeleton = ({ className, ...props }: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-foreground/10 motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
};

export { Skeleton };
