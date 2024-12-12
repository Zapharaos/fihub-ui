import {Routes} from "@angular/router";
import {OverviewComponent} from "@modules/dashboard/pages/overview/overview.component";
import {BrokersComponent} from "@modules/dashboard/pages/brokers/brokers.component";
import {AddBrokerComponent} from "@modules/dashboard/pages/brokers/add-broker/add-broker.component";

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
    component: AddBrokerComponent,
  },
];
