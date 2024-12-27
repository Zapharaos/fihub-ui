import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {PrimeTemplate} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {applyFilterGlobal} from "@shared/utils/table";
import {InputTextModule} from "primeng/inputtext";
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, NgIf} from "@angular/common";
import {finalize} from "rxjs";
import {NotificationService} from "@shared/services/notification.service";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";
import {BrokerImageService, TransactionWithImage} from "@shared/services/broker-image.service";
import {handleErrors} from "@shared/utils/errors";

@Component({
    selector: 'app-transactions-list',
    imports: [
        DashboardContentLayoutComponent,
        TranslatePipe,
        PrimeTemplate,
        TableModule,
        Button,
        Tag,
        IconField,
        InputIcon,
        InputTextModule,
        RouterLink,
        CurrencyPipe,
        NgIf,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  // TODO : export?
  // TODO : filter?
  // TODO : stateful?
  // TODO : pagination?

  protected readonly tablePropertiesFilter = ['date', 'broker.name', 'transaction_type', 'asset', 'quantity', 'price', 'priceUnit', 'fee']

  loading = false;
  transactions!: TransactionWithImage[];
  selectedTransaction: TransactionWithImage | undefined;
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private notificationService: NotificationService,
    private brokerImageService: BrokerImageService,
    private transactionStore: TransactionStore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadTransactions()
  }

  // Transactions

  loadTransactions() {
    this.loading = true;
    this.brokerImageService.cacheImagesAndGetTransactionsWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (transactions: TransactionWithImage[]) => {
        this.transactions = transactions;
      },
      error: (error: any) => {
        handleErrors(error, this.notificationService);
      }
    });
  }

  // Utils

  getTypeSeverity(status: string) {
    switch (status) {
      case 'BUY':
        return 'success';
      case 'SELL':
        return 'danger';
      default:
        return undefined;
    }
  }

  // Table

  onRowSelect(event: any) {

    // Store transaction
    this.transactionStore.transaction = this.selectedTransaction;

    // Move to transaction page
    this.router.navigate(['/dashboard/transactions', this.selectedTransaction?.id]);
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
