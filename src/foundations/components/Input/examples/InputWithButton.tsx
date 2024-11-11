import { Input } from '@/foundations/components/Input';
import { Button, ButtonIcon } from '@/foundations/components/Button';
import { ArrowRight } from '@/foundations/components/Icons';

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
