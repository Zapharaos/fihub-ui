import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/pages/overview/overview.component";
import {BrokersComponent} from "@modules/dashboard/pages/brokers/brokers.component";
import {BrokersAddComponent} from "@modules/dashboard/pages/brokers-add/brokers-add.component";
import {TransactionsComponent} from "@modules/dashboard/pages/transactions/transactions.component";
import {TransactionsAddComponent} from "@modules/dashboard/pages/transactions-add/transactions-add.component";

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
    path: 'brokers/add',
    component: BrokersAddComponent,
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    path: 'transactions/add',
    component: TransactionsAddComponent,
  },
];
