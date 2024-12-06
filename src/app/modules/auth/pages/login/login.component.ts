import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UsersService, UsersUserWithPassword} from "@core/api";
import {finalize} from "rxjs";
import {MessageService} from 'primeng/api';
import {FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";

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
    private usersService: UsersService,
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

    // TODO
    this.messageService.add({
      key: 'main-toast',
      severity: 'success',
      summary: this.translateService.instant('login.toast.success-summary'),
      detail: this.translateService.instant('login.toast.success-details', {email: user.email}),
      life: 5000
    });

    /*this.usersService.createUser(user).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: this.translateService.instant('login.toast.success-summary'),
          detail: this.translateService.instant('login.toast.success-details', {email: user.email}),
          life: 5000
        });
        this.router.navigate(['/dashboard'])
      },
      error: (error: any) => {
        this.authFormComponent.handleError(error)
      },
    })*/
  }
}
