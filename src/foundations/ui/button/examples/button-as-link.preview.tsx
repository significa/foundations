import { Button } from "@/foundations/ui/button/button";
import { ArrowSquareOutIcon, PackageIcon } from "@phosphor-icons/react/dist/ssr";

export default function ButtonLinkPreview() {
  return (
    <Button variant="outline" asChild>
      <a href="https://significa.co" target="_blank">
        <PackageIcon />
        <span>Significa website</span>
        <ArrowSquareOutIcon />
      </a>
    </Button>
  );
}
