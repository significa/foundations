type MenuLink = {
  title: string;
  href: string;
};

type MenuSection = {
  title: string;
  children: MenuLink[];
};

export type MenuItem = MenuLink | MenuSection;

export const isSectionMenuItem = (item: MenuItem): item is MenuSection => {
  return "children" in item;
};
