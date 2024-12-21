import {Component, OnInit} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionsService, TransactionsTransaction} from "@core/api";
import {Button} from "primeng/button";
import {NotificationService} from "@shared/services/notification.service";
import {TransactionStore} from "@shared/stores/transaction.service";
import {finalize} from "rxjs";

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
    private route: ActivatedRoute,
    private router: Router,
    private transactionsService: TransactionsService,
    private transactionStore: TransactionStore,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    // Retrieve transaction
    this.transaction = this.transactionStore.transaction;

    // Handle if transaction is undefined
    if (!this.transaction) {
      this.getTransaction();
    }
  }

  routeToUpdate() {
    this.transactionStore.transaction = this.transaction;
    this.router.navigate(['/dashboard/transactions', this.transaction?.id, 'update']);
  }

  // Transaction

  getTransaction() {
    this.loading = true;
    this.transactionsService.getTransaction(this.route.snapshot.paramMap.get('id') ?? '').pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (transaction: TransactionsTransaction) => {
        this.transaction = transaction;
      },
      error: (error) => {
        this.router.navigate(['dashboard/transactions']);
        switch (error.status) {
          case 401:
            this.notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
            break;
          case 404:
            this.notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      }
    })
  }
}
