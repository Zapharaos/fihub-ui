import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {ResetComponent} from "./reset/reset.component";

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
