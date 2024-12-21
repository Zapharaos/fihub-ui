import {Component, OnInit} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BrokersBroker, TransactionsService, TransactionsTransaction} from "@core/api";
import {Button} from "primeng/button";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";
import {finalize} from "rxjs";
import {NotificationService} from "@shared/services/notification.service";
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import {DialogMode} from "@shared/services/dialog.service";
import {TranslatePipe} from "@ngx-translate/core";
import {ConfirmService} from "@shared/services/confirm.service";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent,
    Button,
    CommonModule,
    TabsModule,
    TranslatePipe,
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
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
  ) {}

  ngOnInit(): void {
    // Retrieve transaction
    this.transaction = this.transactionStore.transaction;

    // If the transaction is not loaded, then retrieve it
    if (!this.transaction) {
      this.loading = true;
      const transactionID = this.route.snapshot.paramMap.get('id');
      this.transactionsService.getTransaction(transactionID!).pipe(finalize(() => {
        this.loading = false;
      })).subscribe({
        next: (transaction: TransactionsTransaction) => {
          this.transactionStore.transaction = transaction;
          this.transaction = transaction;
        },
        error: (error) => {
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
          this.router.navigate(['/dashboard/transactions']);
          return false;
        }
      })
    }
  }

  routeToUpdate() {
    this.transactionStore.transaction = this.transaction;
    this.router.navigate(['/dashboard/transactions', this.transaction?.id, 'update']);
  }

  deleteTransaction(event: Event) {
    this.confirmService.showDeleteConfirmation(event, () => {
      this.transactionsService.deleteTransaction(this.transaction!.id!).pipe(finalize(() => {
        this.loading = false;
      })).subscribe({
        next: () => {
          this.notificationService.showToastSuccess('transactions.messages.delete-success');
          this.router.navigate(['/dashboard/transactions']);
        },
        error: (error) => {
          switch (error.status) {
            case 400:
              this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
              break;
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
    })
  }

  protected readonly DialogMode = DialogMode;
}
