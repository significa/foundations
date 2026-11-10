import { Spinner } from "#/foundations/ui/spinner/spinner.tsx";

export default function SpinnerColorExample() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="text-foreground-secondary" />
      <Spinner className="text-emerald-500" />
      <Spinner className="text-red-500" />
    </div>
  );
}
