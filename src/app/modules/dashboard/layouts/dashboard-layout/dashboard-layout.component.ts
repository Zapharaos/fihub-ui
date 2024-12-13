import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {BasicLayoutComponent} from "@shared/components/basic-layout/basic-layout.component";
import {LayoutItem} from "@shared/models/layout-item";

@Component({
  selector: 'app-overview-layout',
  standalone: true,
  imports: [
    TranslateModule,
    BasicLayoutComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  items: LayoutItem[] = [];

  constructor() {
    this.items = [
      {
        label: 'dashboard.title',
        route: '/dashboard/',
        icon: 'pi-th-large',
        routeActiveExact: true
      },
      {
        label: 'brokers.title',
        route: '/dashboard/brokers',
        icon: 'pi-wallet',
      },
      {
        label: 'settings.title',
        route: '/settings',
        icon: 'pi-cog',
      },
    ];
  }
}
