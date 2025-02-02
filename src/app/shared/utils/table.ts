import {Table} from "primeng/table";
import {SortEvent} from "primeng/api";

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

// note: if the field corresponds to the checkbox column, then checking global checkbox will sort the table
export function multipleSortWithTableCheckbox(event: SortEvent, table: Table) {
  const multiSortMeta = event.multiSortMeta || [];
  event.data?.sort((data1, data2) => {

    for (const meta of multiSortMeta) {
      let value1, value2;

      if (meta.field === 'tableCheckbox') {
        value1 = table.selection.includes(data1) ? 1 : 0;
        value2 = table.selection.includes(data2) ? 1 : 0;
      } else {
        value1 = data1[meta.field];
        value2 = data2[meta.field];
      }

      const result = (value1 < value2 ? -1 : (value1 > value2 ? 1 : 0)) * meta.order;
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
}
