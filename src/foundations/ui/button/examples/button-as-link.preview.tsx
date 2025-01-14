import { Button } from "@/foundations/ui/button/button";
import { ArrowSquareOut, Package } from "@phosphor-icons/react/dist/ssr";

export default function ButtonLinkPreview() {
  return (
    <Button variant="outline" asChild>
      <a href="https://significa.co" target="_blank">
        <Package />
        <span>Significa website</span>
        <ArrowSquareOut />
      </a>
    </Button>
  );
}
