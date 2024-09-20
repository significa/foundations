import { ArrowRight } from 'components/foundations/Icons';
import { Button, ButtonIcon } from 'components/foundations/Button';

export function ButtonSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {['md', 'sm'].map((size: 'md' | 'sm', i) => (
        <div className="flex gap-4" key={i}>
          <Button size={size}>
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
            Button
          </Button>
          <Button size={size}>
            Button
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
          </Button>
          <Button size={size}>Button</Button>
          <Button size={size}>
            <ButtonIcon>
              <ArrowRight />
            </ButtonIcon>
          </Button>
        </div>
      ))}
    </div>
  );
}
