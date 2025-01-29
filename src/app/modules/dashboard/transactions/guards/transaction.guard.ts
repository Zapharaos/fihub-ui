import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {NotificationService} from "@shared/services/notification.service";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";

export const transactionGuard: CanActivateChildFn = (childRoute) => {

  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const transactionStore = inject(TransactionStore);

  // Get the transaction ID from the route
  const transactionID = childRoute.paramMap.get('id');

  // If there is no transaction ID, then redirect to the transactions list
  if (!transactionID) {
    notificationService.showToastError('transactions.messages.invalid-id');
    router.navigate(['/dashboard/transactions']);
    return false;
  }

  // Retrieve the transaction from the store
  const transaction = transactionStore.transaction;

  // IF the transaction is loaded and the ID matches, then pass
  return !(transaction && transaction.id !== transactionID);
};
