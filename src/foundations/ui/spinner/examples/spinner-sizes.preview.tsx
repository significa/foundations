import { Spinner } from "../spinner";

export default function SpinnerSizesExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}
