import { Progress } from "#/foundations/ui/progress/progress.tsx";

export default function ProgressExample() {
  return (
    <div className="w-64">
      <Progress value={60} />
    </div>
  );
}
