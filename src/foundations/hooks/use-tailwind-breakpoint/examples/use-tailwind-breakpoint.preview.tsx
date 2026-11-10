import { useTailwindBreakpoint } from "#/foundations/hooks/use-tailwind-breakpoint/use-tailwind-breakpoint.ts";
import { cn } from "#/lib/utils/classnames.ts";

export default function UseTailwindBreakpointPreview() {
  const sm = useTailwindBreakpoint("sm");
  const md = useTailwindBreakpoint("md");
  const lg = useTailwindBreakpoint("lg");

  const getBackgroundColor = () => {
    if (lg) return "bg-green-500";
    if (md) return "bg-yellow-500";
    if (sm) return "bg-blue-500";
    return "bg-red-500";
  };

  const getDeviceText = () => {
    if (lg) return "Desktop Device (≥1024px)";
    if (md) return "Tablet Device (≥768px)";
    if (sm) return "Small Device (≥640px)";
    return "Mobile Device (≥640px)";
  };

  return (
    <div
      className={cn(
        "h-full w-full rounded-xl border border-border p-6 text-black transition-colors duration-300",
        getBackgroundColor(),
      )}
    >
      <div className="flex h-full items-center justify-center rounded-lg bg-white/50 p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{getDeviceText()}</p>
          <p className="mt-2 text-sm text-gray-600">
            Resize your browser to see the background change!
          </p>
        </div>
      </div>
    </div>
  );
}
