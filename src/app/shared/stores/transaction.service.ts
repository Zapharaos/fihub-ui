import { Injectable } from '@angular/core';
import {TransactionsTransaction} from "@core/api";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransactionStore {

  private readonly _transaction = new BehaviorSubject<TransactionsTransaction | null>(null);
  readonly transaction$ = this._transaction.asObservable();

  get transaction(): TransactionsTransaction | undefined {
    return this._transaction.getValue() ?? undefined;
  }

  set transaction(val: TransactionsTransaction | undefined) {
    this._transaction.next(val ?? null);
  }

  updateTransaction(updatedTransaction: TransactionsTransaction) {
    if (this.transaction && this.transaction.id === updatedTransaction.id) {
      this.transaction = updatedTransaction;
    }
  }

  clearTransaction() {
    this.transaction = undefined;
  }
}
