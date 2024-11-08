import { ArrowRight } from '@/foundations/components/Icons';
import { Button, ButtonIcon } from '@/foundations/components/Button';

export function ButtonDisabled() {
  return (
    <div className="flex gap-4">
      <Button disabled>
        Button
        <ButtonIcon>
          <ArrowRight />
        </ButtonIcon>
      </Button>
      <Button disabled>Button</Button>
      <Button disabled>
        <ButtonIcon>
          <ArrowRight />
        </ButtonIcon>
      </Button>
    </div>
  );
}
