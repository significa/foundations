import { Button } from "@/foundations/ui/button/button";
import { HandPointing } from "@phosphor-icons/react/dist/ssr";

export default function ButtonExample() {
  return (
    <Button>
      <HandPointing />
      <span>Click me</span>
    </Button>
  );
}
