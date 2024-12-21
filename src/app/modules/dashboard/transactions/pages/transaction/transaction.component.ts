import {Component, OnInit} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Router} from "@angular/router";
import {TransactionsTransaction} from "@core/api";
import {Button} from "primeng/button";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent,
    Button,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {

  loading = false;
  transaction: TransactionsTransaction | undefined;

  constructor(
    private router: Router,
    private transactionStore: TransactionStore,
  ) {}

  ngOnInit(): void {
    // Retrieve transaction
    this.transaction = this.transactionStore.transaction;
  }

  routeToUpdate() {
    this.transactionStore.transaction = this.transaction;
    this.router.navigate(['/dashboard/transactions', this.transaction?.id, 'update']);
  }
}
