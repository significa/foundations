import { useEffect, useMemo, useRef, useState } from "react";
import { NumberInput } from "@/foundations/ui/number-input/number-input";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import { debounce } from "@/foundations/utils/debounce/debounce";
import { cn } from "@/lib/utils/classnames";

// Cart-style quantity selector: optimistic local update on every commit,
// debounced server sync in the background. The field stays interactive while
// in-flight — disabling mid-sync would feel laggy. The status indicator lives
// outside the input so the field's centered value stays optically balanced.
export default function NumberInputAsyncExample() {
  const [quantity, setQuantity] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const inFlight = useRef(0);

  const sync = useMemo(
    () =>
      debounce(async (_next: number) => {
        const id = ++inFlight.current;
        setSyncing(true);
        // Pretend to hit a server.
        await new Promise((r) => setTimeout(r, 800));
        // Only clear if this is the latest call.
        if (id === inFlight.current) setSyncing(false);
      }, 400),
    [],
  );

  useEffect(() => {
    sync(quantity);
  }, [quantity, sync]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-48">
        <NumberInput value={quantity} onValueChange={setQuantity} min={1} max={99} />
      </div>
      <Spinner
        size="sm"
        className={cn("transition-opacity", syncing ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
