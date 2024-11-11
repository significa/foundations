import { Button, ButtonIcon } from '@/foundations/components/Button';
import { Hashtag } from '@/foundations/components/Icons';

export function ButtonAsChild() {
  return (
    <Button asChild variant="secondary">
      <a href="#as-child">
        <ButtonIcon>
          <Hashtag />
        </ButtonIcon>
        Anchor
      </a>
    </Button>
  );
}
