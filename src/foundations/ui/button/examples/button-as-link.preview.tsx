import {
  ArrowSquareOutIcon,
  PackageIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/foundations/ui/button/button';

export default function ButtonLinkPreview() {
  return (
    <Button variant="outline" asChild>
      <a href="https://significa.co" target="_blank" rel="noopener">
        <PackageIcon />
        <span>Significa website</span>
        <ArrowSquareOutIcon />
      </a>
    </Button>
  );
}
