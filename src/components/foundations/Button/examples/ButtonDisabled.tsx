import { ArrowRight } from 'components/foundations/Icons';
import { Button, ButtonIcon } from 'components/foundations/Button';

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
