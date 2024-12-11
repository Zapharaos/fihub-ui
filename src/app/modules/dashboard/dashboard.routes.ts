import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/pages/overview/overview.component";
import {BrokersComponent} from "@modules/dashboard/pages/brokers/brokers.component";

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
