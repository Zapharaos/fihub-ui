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
];
