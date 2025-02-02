import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/admin/pages/overview/overview.component";
import {BrokersComponent} from "@modules/dashboard/admin/pages/brokers/brokers.component";
import {permissionGuard} from "@shared/guards/permission.guard";

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: 'brokers',
    component: BrokersComponent,
    canActivate: [permissionGuard],
    data: {
      permission: 'admin.brokers.list',
    }
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.routes').then(m => m.routes),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then(m => m.routes),
  }
];
