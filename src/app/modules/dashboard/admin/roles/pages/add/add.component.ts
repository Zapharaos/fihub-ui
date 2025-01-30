import { Component } from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {TranslatePipe} from "@ngx-translate/core";
import {FormComponent} from "@modules/dashboard/admin/roles/layouts/form/form.component";

@Component({
  selector: 'app-admin-add',
  imports: [
    DashboardContentLayoutComponent,
    ReactiveFormsModule,
    Button,
    Ripple,
    TranslatePipe,
    FormComponent
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

}
