import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    console.log(authService.getToken());
  }
}
