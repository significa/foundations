// import path from "path";
// import { differenceInDays } from "date-fns";
// import { getFoundationsPagePath } from "./constants";
// import {
//   getDirectoryFiles,
//   getMostRecentCreatedDate,
//   getMostRecentModifiedDate,
// } from "./fs";

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
        title: "Date Picker",
        href: "/ui/date-picker",
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
      // {
      //   title: "Dropdown",
      //   href: "/ui/dropdown",
      // },
      // {
      //   title: "Field",
      //   href: "/ui/field",
      // },
      // {
      //   title: "Input",
      //   href: "/ui/input",
      // },
      // {
      //   title: "Label",
      //   href: "/ui/label",
      // },
      // {
      //   title: "Popover",
      //   href: "/ui/popover",
      // },
      {
        title: "Portal",
        href: "/ui/portal",
      },
      // {
      //   title: "Radio",
      //   href: "/ui/radio",
      // },
      // {
      //   title: "Select",
      //   href: "/ui/select",
      // },
      // {
      //   title: "Skeleton",
      //   href: "/ui/skeleton",
      // },
      {
        title: "Spinner",
        href: "/ui/spinner",
      },
      // {
      //   title: "Switch",
      //   href: "/ui/switch",
      // },
      // {
      //   title: "Tabs",
      //   href: "/ui/tabs",
      // },
      // {
      //   title: "Textarea",
      //   href: "/ui/textarea",
      // },
      {
        title: "Tooltip",
        href: "/ui/tooltip",
      },
    ],
  },
  {
    title: "Utils",
    children: [
      {
        title: "Compose Refs",
        href: "/utils/compose-refs",
      },
    ],
  },
];

export const getNavigationWithTags = async () => {
  return await Promise.all(
    navigation.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children.sort((a, b) => a.title.localeCompare(b.title))
        // TODO: uncomment in 30 days when not everything is "new"
        // .map(async (child) => {
        //   const filePath = path.join(
        //     process.cwd(),
        //     getFoundationsPagePath(child.href.split("/"))
        //   );
        //   const created = await getMostRecentCreatedDate(
        //     await getDirectoryFiles(path.dirname(filePath))
        //   );
        //   const isNew = differenceInDays(new Date(), created) < 30;

        //   const updated = await getMostRecentModifiedDate(
        //     await getDirectoryFiles(path.dirname(filePath))
        //   );
        //   const isUpdated = differenceInDays(new Date(), updated) < 15;

        //   return {
        //     ...child,
        //     tag: isNew ? "new" : isUpdated ? "updated" : undefined,
        //   };
        // })
      ),
    }))
  );
};
