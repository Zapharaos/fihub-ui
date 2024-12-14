import {Table} from "primeng/table";

export function applyFilterGlobal($event: any, dt: Table | undefined, stringVal: any) {
  dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

export function onRowEditInit(itemsClone: { [key: string]: any }, item: any) {
  itemsClone[item.id as string] = { ...item };
}

export function onRowEditCancel(items: any[], itemsClone: { [key: string]: any }, item: any, index: number) {
  items[index] = itemsClone[item.id as string];
  delete itemsClone[item.id as string];
}

export function onRowEditSave(itemsClone: { [key: string]: any }, item: any) {
  delete itemsClone[item.id as string];
}
