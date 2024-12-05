import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {FormUser} from "@shared/models/form-user";
import {UsersService} from "@core/api";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AuthFormComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authFormFieldConfig: AuthFormFieldConfig = {
    hasEmail: true,
    hasPasswordFeedback: true,
    hasConfirmation: true,
    checkboxLabel: "register.agreement",
    submitLabel: "register.submit",
    hasLoginLink: true,
  };
  user: FormUser = {};
  loading = false;
  error = false;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {

  }

  register() {
    this.loading = true;
    this.usersService.createUser(this.user).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: this.translateService.instant('register.toast.success-summary'),
          detail: this.translateService.instant('register.toast.success-details'),
          life: 400000
        });
        this.router.navigate(['/auth'])
      },
      error: (error: any) => {
        console.log(error)
      },
    })
  }
}
