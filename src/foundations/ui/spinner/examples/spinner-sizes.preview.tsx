import { Spinner } from "#/foundations/ui/spinner/spinner.tsx";

export default function SpinnerSizesExample() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}
