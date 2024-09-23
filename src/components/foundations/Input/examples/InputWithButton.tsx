import { Input } from 'components/foundations/Input';
import { Button, ButtonIcon } from 'components/foundations/Button';
import { ArrowRight } from 'components/foundations/Icons';

export function InputWithButton() {
  return (
    <div className="flex gap-2 items-end">
      <Input type="input-email" placeholder="egg@significa.co" label="Email" />
      <Button>
        <ButtonIcon>
          <ArrowRight />
        </ButtonIcon>
      </Button>
    </div>
  );
}
