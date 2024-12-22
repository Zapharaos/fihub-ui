import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TransactionWithImage} from "@core/services/broker-data.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionStore {

  private readonly _transaction = new BehaviorSubject<TransactionWithImage | null>(null);
  readonly transaction$ = this._transaction.asObservable();

  get transaction(): TransactionWithImage | undefined {
    return this._transaction.getValue() ?? undefined;
  }

  set transaction(val: TransactionWithImage | undefined) {
    this._transaction.next(val ?? null);
  }

  updateTransaction(updatedTransaction: TransactionWithImage) {
    if (this.transaction && this.transaction.id === updatedTransaction.id) {
      this.transaction = updatedTransaction;
    }
  }

  clearTransaction() {
    this.transaction = undefined;
  }
}
