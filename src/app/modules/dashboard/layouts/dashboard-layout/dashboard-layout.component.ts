import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {BasicLayoutComponent} from "@shared/layouts/basic-layout/basic-layout.component";
import {LayoutItem} from "@shared/models/layout-item";

@Component({
    selector: 'app-overview-layout',
  imports: [
    TranslateModule,
    BasicLayoutComponent,
  ],
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.scss'
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
        label: 'admin.title',
        icon: 'pi-users',
        subItemsInvisible: true,
        permission: 'front.admin.overview',
        items: [
          {
            label: 'admin.overview.title',
            route: '/dashboard/admin',
            routeActiveExact: true,
            permission: 'front.admin.overview',
          },
          {
            label: 'admin.brokers.title',
            route: '/dashboard/admin/brokers',
            permission: 'front.admin.brokers',
          },
          {
            label: 'admin.roles.title',
            route: '/dashboard/admin/roles',
            permission: 'front.admin.roles',
          },
          {
            label: 'admin.users.title',
            route: '/dashboard/admin/users',
            permission: 'front.admin.users',
          }
        ]
      },
      {
        label: 'brokers.title',
        route: '/dashboard/brokers',
        icon: 'pi-wallet',
      },
      {
        label: 'transactions.title',
        route: '/dashboard/transactions',
        icon: 'pi-book',
      },
      {
        label: 'settings.title',
        icon: 'pi-cog',
        subItemsInvisible: true,
        items: [
          {
            label: 'settings.account.title',
            route: '/settings/account',
          },
        ]
      },
    ];
  }
}
