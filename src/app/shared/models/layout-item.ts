export interface LayoutItem {
  label: string;
  icon?: string;
  route?: string;
  routeActiveExact?: boolean;
  items?: LayoutItem[];
  subItemsInvisible?: boolean;
  permission?: string;
}
