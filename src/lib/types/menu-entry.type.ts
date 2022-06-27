export type MenuStatus = "soon" | "beta" | "alpha";

export type MenuEntry = {
  title: string;
  path: string;
  status: MenuStatus;
  subMenu?: MenuEntry[];
};
