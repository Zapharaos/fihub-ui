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
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

}
