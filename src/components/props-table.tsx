import { cn } from "@/lib/utils";

interface PropsTableProps {
  definitions: Record<
    string,
    {
      default?: string;
      type: string | string[];
      description?: string;
    }
  >;
}

export const PropsTable = ({ definitions }: PropsTableProps) => {
  const hasDescription = Object.values(definitions).some(
    ({ description }) => description
  );

  const thClasses = cn("p-2 text-left font-semibold");
  const tdClasses = cn("p-2 py-3 text-left text-sm");
  const codeClasses = cn(
    "font-mono text-sm font-medium rounded-sm px-1 py-0.5 bg-foreground/4 border text-foreground-secondary whitespace-nowrap"
  );

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-b-0">
      <table className="w-full">
        <thead>
          <tr className="border-border m-0 border-b">
            <th className={cn(hasDescription ? "w-1/6" : "w-1/4", thClasses)}>
              Prop
            </th>
            <th className={cn(hasDescription ? "w-1/6" : "w-1/4", thClasses)}>
              Default
            </th>
            <th className={cn(hasDescription ? "w-2/6" : "w-2/4", thClasses)}>
              Type
            </th>
            {hasDescription && (
              <th className={cn("w-2/6", thClasses)}>Description</th>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.entries(definitions).map(
            ([prop, { default: defaultValue, type, description }]) => {
              const types = Array.isArray(type) ? type : [type];

              return (
                <tr key={prop} className="border-border m-0 border-b">
                  <td className={tdClasses}>
                    <span className={codeClasses}>{prop}</span>
                  </td>
                  <td className={tdClasses}>
                    <span className={codeClasses}>{defaultValue || "-"}</span>
                  </td>
                  <td className={cn(tdClasses, "flex flex-wrap gap-1")}>
                    {types.map((t, index) => (
                      <span key={index} className={codeClasses}>
                        {t}
                      </span>
                    ))}
                  </td>
                  {hasDescription && (
                    <td className={tdClasses}>{description || "-"}</td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};
