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

const tablePropertiesFilter = ['date', 'broker', 'type', 'asset', 'quantity', 'price', 'fee']

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
        quantity: '1',
        price: '100.000,00',
        priceUnit: '100.000,00',
        fee: '$19'
      },
      {
        id: '1',
        date: 'yesterday',
        broker: 'Binance',
        type: 'SELL',
        asset: 'BTC',
        quantity: '1',
        price: '100.000,00',
        priceUnit: '100.000,00',
        fee: '$19'
      },
      {
        id: '2',
        date: 'bla',
        broker: 'Ledger',
        type: 'BUY',
        asset: 'ETH',
        quantity: '1',
        price: '100.000,00',
        priceUnit: '100.000,00',
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

  protected readonly tablePropertiesFilter = tablePropertiesFilter;
  protected readonly applyFilterGlobal = applyFilterGlobal;
}
