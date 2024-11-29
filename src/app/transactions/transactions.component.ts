import {Component} from '@angular/core';
import { TableModule } from 'primeng/table';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TableModule, RouterLink],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
}
