import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

interface TransactionType {
  name: string;
  code: string;
}

const TransactionTypes: TransactionType[] = [
  { name: 'Buy', code: 'BUY' },
  { name: 'Sell', code: 'SELL' },
]

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    RouterLink, CardModule, FormsModule, DropdownModule, CalendarModule, InputTextModule, InputNumberModule
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {

  types: TransactionType[] | undefined;
  selectedType: TransactionType | undefined;
  date: Date | undefined;
  currency: String | undefined;
  quantity: number | undefined;
  price: number | undefined;

  ngOnInit() {
    this.types = TransactionTypes;
  }
}
