import {Component, OnInit} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TransactionsService, TransactionsTransaction} from "@core/api";
import {finalize} from "rxjs";
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent,
    Button,
    NgIf,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {

  loading = false;
  transaction: TransactionsTransaction | undefined;

  constructor(
    private route: ActivatedRoute,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {

    this.loading = true;
    this.transactionsService.getTransaction(this.route.snapshot.paramMap.get('id')!).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (transaction: TransactionsTransaction) => {
        this.transaction = transaction;
      },
      error: () => {
      }
    });
  }
}
