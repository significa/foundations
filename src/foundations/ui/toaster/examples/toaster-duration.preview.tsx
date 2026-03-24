import { Button } from '@/foundations/ui/button/button';
import { toast } from '@/foundations/ui/toaster/toaster';

const ToasterDurationPreview = () => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => toast({ title: 'This is a 7 second toast!' })}
      >
        Default
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast({ title: 'This is a 3 second toast!', duration: 3000 })
        }
      >
        Short
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: 'This is an infinity toast!',
            description: 'It will not disappear until you dismiss it.',
            duration: Infinity,
          })
        }
      >
        Infinite
      </Button>
    </div>
  );
};

export default ToasterDurationPreview;
