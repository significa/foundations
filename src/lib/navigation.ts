type NavigationItem = {
  title: string;
  children: {
    title: string;
    href: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
};

export const navigation: NavigationItem[] = [
  {
    title: "Introduction",
    children: [
      {
        title: "About",
        href: "/about",
      },
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
        title: "Avatar",
        href: "/ui/avatar",
      },
      {
        title: "Badge",
        href: "/ui/badge",
      },
      {
        title: "Button",
        href: "/ui/button",
      },
      {
        title: "Calendar",
        href: "/ui/calendar",
      },
      {
        title: "Checkbox",
        href: "/ui/checkbox",
      },
      {
        title: "Checkboxes Hierarchy",
        href: "/ui/checkboxes-hierarchy",
      },
      {
        title: "Date Picker",
        href: "/ui/date-picker",
      },
      {
        title: "Color Picker",
        href: "/ui/color-picker",
      },
      {
        title: "Dialog",
        href: "/ui/dialog",
      },
      {
        title: "Disclosure",
        href: "/ui/disclosure",
      },
      {
        title: "Divider",
        href: "/ui/divider",
      },
      {
        title: "Drawer",
        href: "/ui/drawer",
      },
      {
        title: "Dropdown",
        href: "/ui/dropdown",
      },
      {
        title: "Input",
        href: "/ui/input",
      },
      {
        title: "Label",
        href: "/ui/label",
      },
      {
        title: "Listbox",
        href: "/ui/listbox",
      },
      {
        title: "Popover",
        href: "/ui/popover",
      },
      {
        title: "Portal",
        href: "/ui/portal",
      },
      {
        title: "Radio",
        href: "/ui/radio",
      },
      {
        title: "Select",
        href: "/ui/select",
      },

      {
        title: "Slider",
        href: "/ui/slider",
      },
      {
        title: "Skeleton",
        href: "/ui/skeleton",
      },
      {
        title: "Spinner",
        href: "/ui/spinner",
      },
      {
        title: "Switch",
        href: "/ui/switch",
      },
      {
        title: "Tabs",
        href: "/ui/tabs",
      },
      {
        title: "Textarea",
        href: "/ui/textarea",
      },
      {
        title: "Tooltip",
        href: "/ui/tooltip",
      },
      {
        title: "Modal",
        href: "/ui/modal",
      },
    ],
  },
  {
    title: "Components",
    children: [
      {
        title: "InstanceCounter",
        href: "/components/instance-counter",
      },
      {
        title: "Marquee",
        href: "/components/marquee",
      },
      {
        title: "Sequence",
        href: "/components/sequence",
      },
      {
        title: "Slot",
        href: "/components/slot",
      },
      {
        title: "Stack",
        href: "/components/stack",
      },
    ],
  },
  {
    title: "Utils",
    children: [
      {
        title: "composeRefs",
        href: "/utils/compose-refs",
      },
      {
        title: "debounce",
        href: "/utils/debounce",
      },
      {
        title: "dom",
        href: "/utils/dom",
      },
      {
        title: "math",
        href: "/utils/math",
      },
    ],
  },
  {
    title: "Hooks",
    children: [
      {
        title: "useIntersectionObserver",
        href: "/hooks/use-intersection-observer",
      },
      {
        title: "useStableCallback",
        href: "/hooks/use-stable-callback",
      },
      {
        title: "useMousePan",
        href: "/hooks/use-mouse-pan",
      },
      {
        title: "useScrollLock",
        href: "/hooks/use-scroll-lock",
      },
      {
        title: "useTicker",
        href: "/hooks/use-ticker",
      },
      {
        title: "useTopLayer",
        href: "/hooks/use-top-layer",
      },
      {
        title: "usePrefersReducedMotion",
        href: "/hooks/use-prefers-reduced-motion",
      },
      {
        title: "useMatchMedia",
        href: "/hooks/use-match-media",
      },
      {
        title: "useTailwindBreakpoint",
        href: "/hooks/use-tailwind-breakpoint",
      },
      {
        title: "useDetectDevice",
        href: "/hooks/use-detect-device",
      },
      {
        title: "useElementTransition",
        href: "/hooks/use-element-transition",
      },
    ],
  },
  {
    title: "Guides",
    children: [
      {
        title: "Accessible Forms",
        href: "/guides/accessible-forms",
      },
      {
        title: "Automated Tests",
        href: "/guides/automated-tests",
      },
      {
        title: "Performance Tracking",
        href: "/guides/performance-tracking",
      },
    ],
  },
];
