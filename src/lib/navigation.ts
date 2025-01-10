type NavigationItem = {
  title: string;
  children: {
    title: string;
    href: string;
    tag?: string;
  }[];
};

export const navigation: NavigationItem[] = [
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
