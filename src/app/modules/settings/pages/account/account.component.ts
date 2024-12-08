import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-account',
  standalone: true,
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
    private translateService: TranslateService,
    private messageService: MessageService
  ) {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(
      () => {
        forkJoin([
          this.translateService.get('messages.success'),
          this.translateService.get('auth.messages.logout-success')]
        ).subscribe(([summary, detail]) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 5000
          });
        });
      }
    );
  }
}
