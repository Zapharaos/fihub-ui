import { Routes } from '@angular/router';
import {TransactionComponent} from "./transaction/transaction.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
