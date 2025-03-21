import path from "path";
import { getFoundationsPagePath } from "./constants";
import {
  getDirectoryFiles,
  getMostRecentCreatedDate,
  getMostRecentModifiedDate,
} from "./fs";

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
        title: "useTicker",
        href: "/hooks/use-ticker",
      },
      {
        title: "usePrefersReduceMotion",
        href: "/hooks/use-prefers-reduce-motion",
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
    ],
  },
];

export const getNavigationWithDates = async () => {
  return await Promise.all(
    navigation.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(async (child) => {
            const filePath = path.join(
              process.cwd(),
              getFoundationsPagePath(child.href.split("/"))
            );
            const createdAt = await getMostRecentCreatedDate(
              await getDirectoryFiles(path.dirname(filePath))
            );

            const updatedAt = await getMostRecentModifiedDate(
              await getDirectoryFiles(path.dirname(filePath))
            );

            return {
              ...child,
              createdAt,
              updatedAt,
            };
          })
      ),
    }))
  );
};
