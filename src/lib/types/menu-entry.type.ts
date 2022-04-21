export type MenuStatus = "soon" | "beta";

export type MenuEntry = {
  title: string;
  isSubeMenuCategoryHeader: boolean;
  path?: string;
  status: MenuStatus;
  subMenu?: MenuEntry[];
};
