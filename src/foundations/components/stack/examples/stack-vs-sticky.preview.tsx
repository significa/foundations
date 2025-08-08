"use client";

import { FireIcon,LeafIcon, PizzaIcon } from "@phosphor-icons/react";

import {
  Stack,
  StackHeader,
  StackItem,
} from "@/foundations/components/stack/stack";
import { Divider } from "@/foundations/ui/divider/divider";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Pizza Toppings",
    icon: PizzaIcon,
    content:
      "The perfect pizza starts with quality ingredients. From fresh mozzarella to hand-crushed tomatoes, every topping should be carefully selected and balanced.",
  },
  {
    title: "Dough Secrets",
    icon: LeafIcon,
    content:
      "The key to great pizza dough is patience. Let it ferment slowly in the fridge for 24-72 hours to develop complex flavors and the perfect texture.",
  },
  {
    title: "Baking Tips",
    icon: FireIcon,
    content:
      "A blazing hot oven is crucial for pizza perfection. Preheat your oven to its highest setting with a pizza stone inside for at least an hour before baking.",
  },
];

const StackVsStickyPreview = () => {
  return (
    <div className="grid grid-cols-2 gap-8 pt-[50vh] pb-[100vh]">
      <div>
        <h2 className="mb-8 px-4 text-lg font-medium">Stack Implementation</h2>
        <Stack stick="top">
          {items.map((item, index) => (
            <StackItem key={index} className="bg-background px-4">
              <StackHeader className="text-xl">
                <div className="flex items-center gap-3">
                  <item.icon className="size-6" />
                  <h3 className="py-2">{item.title}</h3>
                </div>
                <Divider />
              </StackHeader>
              <div className="text-foreground-secondary text-md pt-4 pb-12">
                {item.content}
              </div>
            </StackItem>
          ))}
        </Stack>
      </div>

      <div>
        <h2 className="mb-8 px-4 text-lg font-medium">Position: Sticky</h2>
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "bg-background sticky top-0",
                index === 0 && "top-0",
                index === 1 && "top-12",
                index === 2 && "top-24"
              )}
            >
              <div className="bg-background h-12 px-4">
                <div className="flex h-12 items-center gap-3 text-xl">
                  <item.icon className="size-6" />
                  <h3 className="py-2">{item.title}</h3>
                </div>
                <Divider />
              </div>
              <div className="text-foreground-secondary text-md pt-4 pb-12">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackVsStickyPreview;
