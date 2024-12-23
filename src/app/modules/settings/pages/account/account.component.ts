import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@shared/services/notification.service";

@Component({
    selector: 'app-account',
    imports: [
        Button
    ],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      this.notificationService.showToastSuccess('auth.messages.logout-success')
    });
  }
}
