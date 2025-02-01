import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/admin/users/pages/list/list.component";
import {UpdateComponent} from "@modules/dashboard/admin/users/pages/update/update.component";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
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
