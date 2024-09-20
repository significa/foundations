import { ArrowRight } from 'components/foundations/Icons';
import { Button, ButtonIcon } from 'components/foundations/Button';

export function ButtonLoading() {
  return (
    <div className="flex gap-4">
      <Button loading>
        Button
        <ButtonIcon>
          <ArrowRight />
        </ButtonIcon>
      </Button>
      <Button loading>Button</Button>
      <Button loading>
        <ButtonIcon>
          <ArrowRight />
        </ButtonIcon>
      </Button>
    </div>
  );
}
