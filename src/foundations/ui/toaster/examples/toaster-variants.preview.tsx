import { Button } from "#/foundations/ui/button/button.tsx";
import { toast } from "#/foundations/ui/toaster/toaster.tsx";

const ToasterVariantsPreview = () => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => toast({ title: "This is a toast notification!", variant: "default" })}
      >
        Default
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: "This is a positive toast notification!",
            variant: "positive",
          })
        }
      >
        Positive
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: "This is a negative toast notification!",
            variant: "negative",
          })
        }
      >
        Negative
      </Button>
    </div>
  );
};

export default ToasterVariantsPreview;
