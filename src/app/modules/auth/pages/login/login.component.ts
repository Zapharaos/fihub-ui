import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UsersUserWithPassword} from "@core/api";
import {finalize} from "rxjs";
import {FormGroup} from "@angular/forms";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {LoginService} from "@modules/auth/services/login.service";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@shared/services/notification.service";

@Component({
    selector: 'app-login',
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
    submitLabel: "auth.login.submit",
    hasRegisterLink: true,
    hasPasswordLink: true,
  };

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) { }

  login(userForm: FormGroup) {

    this.authFormComponent.setLoading(true);

    // Retrieving user through Form
    const user: UsersUserWithPassword = userForm.value;

    // Calling service to log the user in
    this.loginService.login(user).pipe(finalize(() => {
      // Call is over
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        // Success
        this.notificationService.showToastSuccess('auth.messages.login-success', {email: user.email})

        // If user was logged off, navigate back to his previous position
        if (this.authService.redirectUrl) {
          this.router.navigateByUrl(this.authService.redirectUrl).catch(() => {
            this.router.navigate(['/dashboard']);
          });
          this.authService.setRedirectUrl();
        } else {
          // Head to default logged-in URL
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: Error) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    })
  }
}
