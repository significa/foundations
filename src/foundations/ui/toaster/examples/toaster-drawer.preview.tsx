import { Button } from "#/foundations/ui/button/button.tsx";
import { Drawer } from "#/foundations/ui/drawer/drawer.tsx";
import { toast } from "#/foundations/ui/toaster/toaster.tsx";

const ToasterDrawerPreview = () => {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button size="sm" variant="outline">
          Open Drawer
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <p>The toast shows above this drawer.</p>

        <div className="flex py-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => toast({ title: "This is a toast notification!" })}
          >
            Emit Toast
          </Button>
        </div>
      </Drawer.Content>
    </Drawer>
  );
};

export default ToasterDrawerPreview;
