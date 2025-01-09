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
    <div className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] border-r border-border sticky top-14 md:p-2 p-1">
      <Menu items={menu} />
    </div>
  );
};
