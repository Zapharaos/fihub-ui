import { Component } from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {FormLayoutComponent} from "@modules/dashboard/transactions/layouts/form-layout/form-layout.component";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-update',
    imports: [
        DashboardContentLayoutComponent,
        FormLayoutComponent
    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateComponent {

  backRoute = '/dashboard/transactions/';

  constructor(
    private route: ActivatedRoute,
  ) {
    this.backRoute += this.route.snapshot.paramMap.get('id')
  }
}
