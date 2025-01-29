import {Table} from "primeng/table";

export function applyFilterGlobal($event: Event, dt: Table | undefined, stringVal: string) {
  dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function onRowEditInit(itemsClone: Record<string, any>, item: any) {
  itemsClone[item.id as string] = { ...item };
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function onRowEditCancel(items: any[], itemsClone: Record<string, any>, item: any, index: number) {
  items[index] = itemsClone[item.id as string];
  delete itemsClone[item.id as string];
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function onRowEditSave(itemsClone: Record<string, any>, item: any) {
  delete itemsClone[item.id as string];
}
