import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/admin/roles/pages/list/list.component";
import {AddComponent} from "@modules/dashboard/admin/roles/pages/add/add.component";
import {UpdateComponent} from "@modules/dashboard/admin/roles/pages/update/update.component";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: 'update',
        component: UpdateComponent,
      },
    ],
  }
];
