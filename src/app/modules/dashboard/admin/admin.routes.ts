import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/admin/pages/overview/overview.component";
import {BrokersComponent} from "@modules/dashboard/admin/pages/brokers/brokers.component";

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: 'brokers',
    component: BrokersComponent,
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
