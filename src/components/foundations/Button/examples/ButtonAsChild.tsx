import { Button } from 'components/foundations/Button';

export function ButtonAsChild() {
  return (
    <Button asChild>
      <a href="#as-child">Anchor</a>
    </Button>
  );
}
