import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {UsersService, UsersUserWithPassword} from "@core/api";
import {FormGroup} from "@angular/forms";
import {NotificationService} from "@shared/services/notification.service";

@Component({
    selector: 'app-register',
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
    private notificationService: NotificationService
  ) { }

  register(userForm: FormGroup) {

    this.authFormComponent.setLoading(true);

    // Retrieving user through Form
    const user : UsersUserWithPassword = {
      email: userForm.get('email')?.value,
      password: userForm.get('password-feedback')?.value,
    }

    // Calling service to register the user
    this.usersService.createUser(user).pipe(finalize(() => {
      // Call is over
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        // Success
        this.notificationService.showToastSuccess('auth.messages.register-success', {email: user.email})
        // Navigate to login page
        this.router.navigate(['/auth'])
      },
      error: (error: any) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    })
  }
}
