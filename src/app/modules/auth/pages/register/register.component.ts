import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {finalize, forkJoin} from "rxjs";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {UsersService, UsersUserWithPassword} from "@core/api";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";

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
    hasEmailControl: true,
    hasPasswordFeedback: true,
    hasConfirmation: true,
    checkboxLabel: "register.agreement",
    submitLabel: "register.submit",
    hasLoginLink: true,
  };

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {

  }

  register(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);
    const user : UsersUserWithPassword = {
      email: userForm.get('email')?.value,
      password: userForm.get('password-feedback')?.value,
    }
    this.usersService.createUser(user).pipe(finalize(() => {
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
        this.router.navigate(['/auth'])
      },
      error: (error: any) => {
        this.authFormComponent.handleError(error)
      },
    })
  }
}
