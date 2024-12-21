import {Routes} from "@angular/router";
import {ListComponent} from "@modules/dashboard/transactions/pages/list/list.component";
import {
  AddComponent
} from "@modules/dashboard/transactions/pages/add/add.component";
import {TransactionComponent} from "@modules/dashboard/transactions/pages/transaction/transaction.component";
import {UpdateComponent} from "@modules/dashboard/transactions/pages/update/update.component";
import {transactionGuard} from "@modules/dashboard/transactions/guards/transaction.guard";

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: ':id',
    canActivateChild: [transactionGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TransactionComponent,
      },
      {
        path: 'update',
        component: UpdateComponent,
      }
    ],
  }

];
