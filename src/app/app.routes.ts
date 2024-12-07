import { Routes } from '@angular/router';
import {authGuard, noAuthGuard} from "@shared/guards/auth.guard";

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
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.routes),
  },
];
