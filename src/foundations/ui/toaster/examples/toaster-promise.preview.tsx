import { Button } from "@/foundations/ui/button/button";
import { toast } from "@/foundations/ui/toaster/toaster";

const wait = (ms: number, fail = false) =>
  new Promise<string>((resolve, reject) =>
    setTimeout(
      () => (fail ? reject(new Error("The server took too long.")) : resolve("#1042")),
      ms,
    ),
  );

const ToasterPromisePreview = () => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast.promise(wait(2000), {
            loading: { title: "Updating your order…", description: "This may take a moment." },
            success: (order) => ({ title: `Order ${order} updated` }),
            error: { title: "We couldn't update your order" },
          })
        }
      >
        Resolve
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast
            .promise(wait(2000, true), {
              loading: { title: "Updating your order…", description: "This may take a moment." },
              success: { title: "Order updated" },
              error: (error) => ({
                title: "We couldn't update your order",
                description: error instanceof Error ? error.message : undefined,
              }),
            })
            .catch(() => {})
        }
      >
        Reject
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          const id = toast({ title: "Uploading 3 files…", variant: "loading" });
          setTimeout(() => toast.update(id, { title: "Uploading 1 file…" }), 1000);
          setTimeout(
            () => toast.update(id, { title: "Files uploaded", variant: "positive" }),
            2000,
          );
        }}
      >
        Update manually
      </Button>
    </div>
  );
};

export default ToasterPromisePreview;
