import { Routes } from '@angular/router';
import {authGuard, noAuthGuard} from "@shared/guards/auth.guard";
import {DashboardLayoutComponent} from "@modules/dashboard/layouts/dashboard-layout/dashboard-layout.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/settings/settings.routes').then(m => m.routes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardLayoutComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.routes),
  },
];
