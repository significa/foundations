"use client";

import { Divider } from "@/foundations/ui/divider/divider";
import { BookOpenIcon, LightbulbIcon, WrenchIcon } from "@phosphor-icons/react";
import {
  Stack,
  StackHeader,
  StackItem,
} from "@/foundations/components/stack/stack";

const items = [
  {
    title: "Getting Started",
    icon: BookOpenIcon,
    content:
      "The Stack component helps create scrollable sections with sticky headers. It's particularly useful for long-form content or documentation where you want to maintain context while scrolling.",
  },
  {
    title: "Key Features",
    icon: LightbulbIcon,
    content:
      "Smooth sticky header transitions, configurable alignment (top/bottom), and automatic content height calculations make this component highly versatile.",
  },
  {
    title: "Implementation",
    icon: WrenchIcon,
    content:
      "To use the Stack component, wrap your content sections in StackItem components and include StackHeader components for the sticky headers. The Stack parent component manages all the positioning and scroll behavior automatically. You can customize the appearance using standard CSS classes and configure the stick behavior using the 'stick' prop.",
  },
];

const StackPreview = () => {
  return (
    <div className="pt-[70vh] pb-[70vh]">
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

            <div className="text-foreground-secondary text-md w-2/3 pt-4 pb-12">
              {item.content}
            </div>
          </StackItem>
        ))}
      </Stack>
    </div>
  );
};

export default StackPreview;
