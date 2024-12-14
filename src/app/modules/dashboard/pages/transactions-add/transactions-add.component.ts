import { Component } from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";

@Component({
  selector: 'app-transactions-add',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent
  ],
  templateUrl: './transactions-add.component.html',
  styleUrl: './transactions-add.component.scss'
})
export class TransactionsAddComponent {

}
