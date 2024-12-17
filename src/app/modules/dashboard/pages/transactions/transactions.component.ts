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
import {RouterLink} from "@angular/router";
import {CurrencyPipe} from "@angular/common";

export type Transaction = {
  id: string;
  date: string;
  broker: string;
  type: string;
  asset: string;
  quantity: string;
  price: string;
  priceUnit: string;
  fee: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
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
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  // TODO : export?
  // TODO : filter?
  // TODO : pagination?
  // TODO : stateful?
  // TODO : open => as dialog into edit/delete ? or new page to view details and then edit/delete?

  protected readonly tablePropertiesFilter = ['date', 'broker', 'type', 'asset', 'quantity', 'price', 'fee']

  loading = false;
  transactions!: Transaction[];
  @ViewChild('dt') dt: Table | undefined;

  ngOnInit(): void {
    this.loadTransactions()
  }

  loadTransactions() {
    this.loading = true;
    // TODO : call API
    this.transactions = [
      {
        id: '0',
        date: 'now',
        broker: 'Binance',
        type: 'BUY',
        asset: 'BTC',
        quantity: '1.3872345',
        price: '17840',
        priceUnit: '12434',
        fee: '$19'
      },
      {
        id: '1',
        date: 'yesterday',
        broker: 'Binance',
        type: 'SELL',
        asset: 'BTC',
        quantity: '0.641234',
        price: '65123',
        priceUnit: '87934',
        fee: '$19'
      },
      {
        id: '2',
        date: 'bla',
        broker: 'Ledger',
        type: 'BUY',
        asset: 'ETH',
        quantity: '4.561243981274',
        price: '3689.123',
        priceUnit: '827.124',
        fee: '$19'
      }];
    this.loading = false;
  }

  onRowOpen(transaction: Transaction) {
    // TODO
  }

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

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
