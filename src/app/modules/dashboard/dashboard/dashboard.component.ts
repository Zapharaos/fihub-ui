import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthService} from "@core/services/auth.service";
import { ButtonModule } from 'primeng/button';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

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
