import { ArrowRight } from '@/foundations/components/Icons';
import { Button, ButtonIcon } from '@/foundations/components/Button';

export function ButtonVariants() {
  return (
    <div className="flex flex-col gap-4">
      {['primary', 'secondary', 'ghost'].map((variant: 'primary' | 'secondary' | 'ghost', i) => (
        <div className="flex gap-4" key={i}>
          <Button variant={variant}>
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
            Button
          </Button>
          <Button variant={variant}>
            Button
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
          </Button>
          <Button variant={variant}>Button</Button>
          <Button variant={variant}>
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
          </Button>
        </div>
      ))}
    </div>
  );
}
