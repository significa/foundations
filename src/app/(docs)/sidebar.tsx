import { Menu } from "./menu";

export const menu: React.ComponentProps<typeof Menu>["items"] = [
  {
    title: "Introduction",
    children: [
      {
        title: "Setup",
        href: "/setup",
      },
    ],
  },
  {
    title: "UI",
    children: [
      {
        title: "Button",
        href: "/ui/button",
      },
      {
        title: "Spinner",
        href: "/ui/spinner",
      },
    ],
  },
];

export const Sidebar = () => {
  return (
    <aside className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] sticky top-14 border-r md:px-2 px-1 w-[250px] shrink-0 pt-6">
      <Menu items={menu} />
    </aside>
  );
};
