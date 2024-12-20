import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/pages/overview/overview.component";

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
  },
  {
    path: 'brokers',
    loadChildren: () => import('./brokers/brokers.routes').then(m => m.routes),
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.routes').then(m => m.routes),
  },
];
