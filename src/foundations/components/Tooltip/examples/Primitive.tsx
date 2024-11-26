import { TooltipPrimitive } from '@/foundations/components/Tooltip';

export function Primitive() {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger>Hover me</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content className="bg-accent text-white">
        <TooltipPrimitive.Arrow className="fill-accent" />
        Hello world
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
