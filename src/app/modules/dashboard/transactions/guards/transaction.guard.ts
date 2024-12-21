import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {NotificationService} from "@shared/services/notification.service";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";
import {TransactionsService, TransactionsTransaction} from "@core/api";
import {finalize} from "rxjs";

export const transactionGuard: CanActivateChildFn = (childRoute, state) => {

  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const transactionStore = inject(TransactionStore);
  const transactionsService = inject(TransactionsService);

  // Get the transaction ID from the route
  const transactionID = childRoute.paramMap.get('id');

  // If there is no transaction ID, then redirect to the transactions list
  if (!transactionID) {
    notificationService.showToastError('transactions.messages.invalid-id');
    router.navigate(['/dashboard/transactions']);
    return false;
  }

  // If the transaction is already loaded, then pass
  const transaction = transactionStore.transaction;
  if (transaction && transaction.id === transactionID) {
    return true;
  }

  // If the transaction is not loaded, then retrieve it
  transactionsService.getTransaction(transactionID).subscribe({
    next: (transaction: TransactionsTransaction) => {
      transactionStore.transaction = transaction;
    },
    error: (error) => {
      switch (error.status) {
        case 401:
          notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
          break;
        case 404:
          notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
          break;
        default:
          notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
          break;
      }
      router.navigate(['/dashboard/transactions']);
      return false;
    }
  })

  return true;
};
