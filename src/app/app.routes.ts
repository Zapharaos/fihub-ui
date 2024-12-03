import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./modules/auth/pages/login/login.component";
import {RegisterComponent} from "./modules/auth/pages/register/register.component";
import {TransactionComponent} from "./modules/dashboard/transaction/transaction.component";
import {TransactionsComponent} from "./modules/dashboard/transactions/transactions.component";
import {ResetComponent} from "./modules/auth/pages/reset/reset.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'reset',
    component : ResetComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'transaction',
    component: TransactionComponent,
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
  }
];
