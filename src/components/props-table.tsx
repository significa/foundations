import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

interface PropsTableProps {
  definition: Record<
    string,
    {
      default?: string;
      required?: boolean;
      type: string | string[];
      description?: string;
    }
  >;
}

export const PropsTable = ({ definition }: PropsTableProps) => {
  const hasDescription = Object.values(definition).some(
    ({ description }) => description
  );

  const thClasses = cn("p-2 text-left font-semibold");
  const tdClasses = cn("p-2 py-3 text-left text-sm align-top");

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
          {Object.entries(definition).map(
            ([
              prop,
              { default: defaultValue, type, description, required },
            ]) => {
              const types = Array.isArray(type) ? type : [type];

              return (
                <tr key={prop} className="border-border m-0 border-b">
                  <td className={cn(tdClasses, "flex items-center gap-1")}>
                    <Markdown>{`\`${prop}\``}</Markdown>
                    {required && <span className="text-red-500"> *</span>}
                  </td>
                  <td className={tdClasses}>
                    {defaultValue !== undefined ? (
                      <Markdown>{`\`${defaultValue}{:ts}\``}</Markdown>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className={cn(tdClasses, "flex flex-wrap gap-1")}>
                    {types.map((t, index) => (
                      <Markdown key={index}>{`\`${t}{:ts}\``}</Markdown>
                    ))}
                  </td>
                  {hasDescription && (
                    <td className={tdClasses}>
                      {description ? <Markdown>{description}</Markdown> : "-"}
                    </td>
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
