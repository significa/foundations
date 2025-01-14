import {
  ArrowSquareOut,
  Package,
  Pencil,
  Sun,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "../button";

export default function ButtonIconsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" square aria-label="Switch theme">
        <Sun />
      </Button>
      <Button variant="outline">
        <Pencil />
        <span>Edit</span>
      </Button>
      <Button variant="outline">
        <Package />
        <span>External link</span>
        <ArrowSquareOut />
      </Button>
    </div>
  );
}
