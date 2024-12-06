import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UsersUserWithPassword} from "@core/api";
import {finalize, forkJoin} from "rxjs";
import {MessageService} from 'primeng/api';
import {FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {LoginService} from "@modules/auth/services/login.service";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        AuthFormComponent
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authFormFieldConfig: AuthFormFieldConfig = {
    hasEmail: true,
    hasPassword: true,
    submitLabel: "login.submit",
    hasRegisterLink: true,
    hasForgotLink: true,
  };

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {

  }

  login(userForm: FormGroup) {

    this.authFormComponent.setLoading(true);
    const user : UsersUserWithPassword = {
      email: userForm.get('email')?.value,
      password: userForm.get('password')?.value,
    }

    this.loginService.login(user).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        forkJoin([
          this.translateService.get('messages.success'),
          this.translateService.get('auth.messages.register-success', {email: user.email})]
        ).subscribe(([summary, detail]) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 5000
          });
        });

        if (this.authService.redirectUrl) {
          this.router.navigateByUrl(this.authService.redirectUrl).catch(() => {
            this.router.navigate(['/dashboard']);
          });
          this.authService.setRedirectUrl();
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: any) => {
        this.authFormComponent.handleError(error)
      },
    })
  }
}
