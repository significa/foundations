import { HandPointingIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/foundations/ui/button/button";

export default function ButtonExample() {
  return (
    <Button>
      <HandPointingIcon />
      <span>Click me</span>
    </Button>
  );
}
