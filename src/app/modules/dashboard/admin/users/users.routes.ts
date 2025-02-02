import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/admin/users/pages/list/list.component";
import {UpdateComponent} from "@modules/dashboard/admin/users/pages/update/update.component";
import {permissionGuard} from "@shared/guards/permission.guard";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [permissionGuard],
    data: {
      permission: 'admin.users.list',
    }
  },
  {
    path: ':id',
    children: [
      {
        path: 'update',
        component: UpdateComponent,
        canActivate: [permissionGuard],
        data: {
          permission: 'admin.users.update',
        }
      },
    ],
  }
];
