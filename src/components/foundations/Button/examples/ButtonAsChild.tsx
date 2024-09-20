import { Button, ButtonIcon } from 'components/foundations/Button';
import { Hashtag } from 'components/foundations/Icons';

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
