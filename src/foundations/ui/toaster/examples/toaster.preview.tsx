import { Button } from "#/foundations/ui/button/button.tsx";
import { toast } from "#/foundations/ui/toaster/toaster.tsx";

const ToasterPreview = () => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          toast({
            title: "This is a toast notification!",
          });
        }}
      >
        Show Toast
      </Button>
    </div>
  );
};

export default ToasterPreview;
