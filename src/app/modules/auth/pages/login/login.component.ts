import {Component} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import {Router, RouterLink} from "@angular/router";
import {Ripple} from "primeng/ripple";
import {UsersUserWithPassword} from "@core/api";
import {finalize} from "rxjs";
import {Message, MessageService} from 'primeng/api';
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    Button,
    InputTextModule,
    PasswordModule,
    DividerModule,
    RouterLink,
    Ripple,
    MessageModule,
    MessagesModule,
    FormsModule,
    NgClass,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user: UsersUserWithPassword = {};
  loading = false;
  error = false;
  messages: Message[] = [];

  /*constructor(private loginService: LoginService,
              private messageService: MessageService,
              private authService: AuthService,
              private router: Router) {
    this.user = {};
  }*/

  login() {
    this.loading = true;

    /*this.loginService.login(this.user).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: user => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          detail: 'welcome' + ` ${user.firstName} !`,
          life: 4000
        });

        if (this.authService.redirectUrl) {
          this.router.navigateByUrl(this.authService.redirectUrl).catch(() => {
            this.router.navigate(['/select-dashboard']);
          });
          this.authService.setRedirectUrl();
        } else {
          this.router.navigate(['/select-dashboard']);
        }

        this.clearErrors();
      },
      error: err => {
        this.setErrorMode();
      }
    })*/
  }

  private clearErrors() {
    this.error = false;
    this.messages = [];
  }

  private setErrorMode() {
    this.error = true;
    if (this.messages.length === 0) {
      this.messages = [{
        severity: "error",
        summary: 'fail'
      } as Message];
    }
  }
}
