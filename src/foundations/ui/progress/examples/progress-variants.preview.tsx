import { Progress } from "@/foundations/ui/progress/progress";

export default function ProgressVariantsExample() {
  return (
    <div className="flex w-64 flex-col items-center gap-8">
      <div className="flex w-full flex-col items-center gap-2">
        <Progress value={70} />
        <span className="text-foreground-secondary text-xs">linear</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Progress value={70} variant="circular" />
        <span className="text-foreground-secondary text-xs">circular</span>
      </div>
    </div>
  );
}
