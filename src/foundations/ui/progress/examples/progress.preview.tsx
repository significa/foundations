import { Progress } from '@/foundations/ui/progress/progress';

export default function ProgressExample() {
  return (
    <div className="w-64">
      <Progress value={60} />
    </div>
  );
}
