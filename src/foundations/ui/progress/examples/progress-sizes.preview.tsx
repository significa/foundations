import { Progress } from "@/foundations/ui/progress/progress";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function ProgressSizesExample() {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-4">
      {sizes.map((size) => (
        <div key={size} className="contents">
          <div className="w-64">
            <Progress value={60} size={size} />
          </div>
          <Progress value={60} size={size} variant="circular" />
        </div>
      ))}
    </div>
  );
}
