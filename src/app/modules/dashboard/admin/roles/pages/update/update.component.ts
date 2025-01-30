import { Component } from '@angular/core';
import {
    DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {FormComponent} from "@modules/dashboard/admin/roles/layouts/form/form.component";

@Component({
  selector: 'app-update',
    imports: [
        DashboardContentLayoutComponent,
        FormComponent
    ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

}
