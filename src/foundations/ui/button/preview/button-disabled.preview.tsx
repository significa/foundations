import { Button } from "@/foundations/ui/button/button";

export default function ButtonDisabledPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
    </div>
  );
}
