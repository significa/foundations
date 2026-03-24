import { Button } from '@/foundations/ui/button/button';
import { Drawer } from '@/foundations/ui/drawer/drawer';
import { toast } from '@/foundations/ui/toaster/toaster';

const ToasterDrawerPreview = () => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          toast({
            title: 'This is a toast notification!',
          });
        }}
      >
        Emit Toast
      </Button>
      <Drawer>
        <Drawer.Trigger asChild>
          <Button size="sm" variant="outline">
            Open Drawer
          </Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <p>This is a drawer content.</p>

          <div className="flex py-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                toast({
                  title: 'This is a toast notification!',
                });
              }}
            >
              Emit Toast
            </Button>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default ToasterDrawerPreview;
