import { TooltipPrimitive } from '@/foundations/components/Tooltip';

export function NoArrowPrimitive() {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger>Hover me</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content>Hello world</TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
