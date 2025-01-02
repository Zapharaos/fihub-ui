import { Routes } from '@angular/router';
import {authGuard, noAuthGuard} from "@shared/guards/auth.guard";
import {DashboardLayoutComponent} from "@modules/dashboard/layouts/dashboard-layout/dashboard-layout.component";
import {BasicLayoutComponent} from "@shared/layouts/basic-layout/basic-layout.component";

export const routes: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
    component: BasicLayoutComponent,
    loadChildren: () => import('./modules/common/common.routes').then(m => m.routes),
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    component: BasicLayoutComponent,
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes),
  },
  {
    path: '',
    component: BasicLayoutComponent,
    loadChildren: () => import('./modules/docs/docs.routes').then(m => m.routes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardLayoutComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.routes),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    component: DashboardLayoutComponent,
    loadChildren: () => import('./modules/settings/settings.routes').then(m => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
