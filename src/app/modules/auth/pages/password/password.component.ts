import {Component, ViewChild} from '@angular/core';
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {Router} from "@angular/router";
import {AuthService, UsersService, UsersUserInputPassword} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {FormGroup} from "@angular/forms";
import {finalize} from "rxjs";

@Component({
  selector: 'app-password',
    imports: [
        AuthFormComponent
    ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {

  protected readonly formConfigForgot: AuthFormFieldConfig = {
    hasEmail: true,
    submitLabel: "auth.password.forgot.submit",
    hasLoginLink: true,
  };

  protected readonly formConfigVerification: AuthFormFieldConfig = {
    hasOtp: true,
    submitLabel: "auth.password.verification.submit",
  };

  protected readonly formConfigReset: AuthFormFieldConfig = {
    hasPasswordFeedback: true,
    hasConfirmation: true,
    submitLabel: "auth.password.reset.submit",
  };

  activeConfig: AuthFormFieldConfig = this.formConfigForgot;
  userID: string = '';
  requestID: string = '';

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  submit(userForm: FormGroup) {
    if (this.activeConfig === this.formConfigForgot) {
      this.forgot(userForm);
    } else if (this.activeConfig === this.formConfigVerification) {
      this.verify(userForm);
    } else if (this.activeConfig === this.formConfigReset) {
      this.reset(userForm);
    }
  }

  forgot(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);
    this.authService.createPasswordResetRequest({
      email: userForm.value.email,
    }).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (userID: string) => {
        this.userID = userID;
        // Success : next step = verify OTP
        this.activeConfig = this.formConfigVerification;
        this.authFormComponent.setConfig(this.formConfigVerification);
        this.notificationService.showToastSuccess('auth.password.messages.send-success')
      },
      error: (error: any) => {
        // An error has occurred
        this.authFormComponent.handleError(error)

        // If the error is that a request is already active, we need to switch to the verification form
        if (error.error.message === 'request-active') {
          // TODO : retrieve the user ID from the error
          this.userID = '8eb3d72c-d7e8-4064-a143-daae180c1b1f';
          this.activeConfig = this.formConfigVerification;
          this.authFormComponent.setConfig(this.formConfigVerification);
        }
      },
    });
  }

  verify(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);
    this.authService.getPasswordResetRequestID(this.userID, userForm.value.otp).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (requestID: string) => {
        this.requestID = requestID;
        // Success : next step = reset password
        this.activeConfig = this.formConfigReset;
        this.authFormComponent.setConfig(this.formConfigReset);
      },
      error: (error: any) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    });
  }

  reset(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);

    // Retrieving inputPassword through Form
    const inputPassword : UsersUserInputPassword = {
      password: userForm.get('password-feedback')?.value,
      confirmation: userForm.get('confirmation')?.value,
    }

    this.authService.resetPassword(this.userID, this.requestID, inputPassword).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        // Success : navigate to login page
        this.router.navigate(['/auth']).then(() => {
          this.notificationService.showToastSuccess('auth.password.messages.reset-success')
        })
      },
      error: (error: any) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    });
  }
}
