import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/transactions/pages/list/list.component";
import {
  AddComponent
} from "@modules/dashboard/transactions/pages/add/add.component";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
];
