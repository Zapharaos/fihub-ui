import {Component} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {FormLayoutComponent} from "@modules/dashboard/transactions/layouts/form-layout/form-layout.component";

@Component({
    selector: 'app-transactions-add',
    imports: [
        DashboardContentLayoutComponent,
        FormLayoutComponent
    ],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss'
})
export class AddComponent {

}
