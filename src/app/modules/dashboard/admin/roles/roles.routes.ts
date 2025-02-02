import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/admin/roles/pages/list/list.component";
import {AddComponent} from "@modules/dashboard/admin/roles/pages/add/add.component";
import {UpdateComponent} from "@modules/dashboard/admin/roles/pages/update/update.component";
import {permissionGuard} from "@shared/guards/permission.guard";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [permissionGuard],
    data: {
      permission: 'admin.roles.list',
    }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [permissionGuard],
    data: {
      permission: 'admin.roles.create',
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
          permission: 'admin.roles.update',
        }
      },
    ],
  }
];
