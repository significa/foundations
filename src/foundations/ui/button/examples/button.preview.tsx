import { Button } from "@/foundations/ui/button/button";
import { HandPointingIcon } from "@phosphor-icons/react/dist/ssr";

export default function ButtonExample() {
  return (
    <Button>
      <HandPointingIcon />
      <span>Click me</span>
    </Button>
  );
}
