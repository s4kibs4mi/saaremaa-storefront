export interface Menu {
  name: string;
  url: string;
  tag: string;
  position: number;
  subMenus: Menu[];
  parentMenu: Menu;
}
