import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {FormGroup} from "@angular/forms";
import {AuthOtpStore, AuthRequestKey} from "@shared/stores/auth-otp.service";
import {LanguageService} from "@shared/services/language.service";
import {AuthFlowComponent, AuthFlowStep} from "@shared/components/auth-flow/auth-flow.component";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-password',
  imports: [
    AuthFlowComponent
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {

  protected readonly authRequestKey: AuthRequestKey = AuthRequestKey.ResetPassword;
  steps: AuthFlowStep[] = [
    {
      formConfig: {
        hasEmail: true,
        submitLabel: "auth.otp-flow.step.init.submit",
        hasLoginLink: true,
      },
      onSubmit: (form: FormGroup) => this.forgot(form),
    },
    {
      formConfig: {
        hasOtp: true,
        submitLabel: "auth.otp-flow.step.verification.submit",
      },
      onSubmit: (form: FormGroup) => this.verify(form),
    },
    {
      formConfig: {
        hasPasswordFeedback: true,
        hasConfirmation: true,
        submitLabel: "auth.otp-flow.password.reset.submit",
      },
      onSubmit: (form: FormGroup) => this.reset(form),
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private authOtpStore: AuthOtpStore,
    private languageService: LanguageService,
  ) {
  }

  async forgot(userForm: FormGroup): Promise<void> {
    try {
      // Call the API to generate a forgotten password OTP
      const request = await firstValueFrom(
        this.authService.generateForgottenPasswordOTP(
          {
            email: userForm.value.email,
          },
          this.languageService.language?.code
        )
      )

      // Show a notification based on the request status
      if (request.error === 'request-active') {
        this.notificationService.showToastWarn('auth.otp-flow.messages.request-active');
      } else {
        this.notificationService.showToastSuccess('auth.otp-flow.messages.send-success');
      }

      // Update the authOtpStore with the request data
      this.authOtpStore.set(this.authRequestKey, {
        identifier: request.identifier,
        expiresAt: request.expires_at,
      })
    } catch (error) {
      // Rethrow the error to the caller
      throw error;
    }
  }

  async verify(userForm: FormGroup): Promise<void> {
    try {
      // Call the API to validate the forgotten password OTP
      // & store the request ID for the next step
      const request = await firstValueFrom(
        this.authService.validateForgottenPasswordOTP(
          {
            otp: userForm.value.otp,
            // user_id: this.identifier,
            user_id: this.authOtpStore.get(this.authRequestKey)?.identifier,
          },
        )
      );

      // Success : store request data
      this.authOtpStore.set(this.authRequestKey, {
        ...this.authOtpStore.get(this.authRequestKey)!,
        requestID: request.request_id,
        expiresAt: request.expires_at,
      });
    } catch (error) {
      // Rethrow the error to the caller
      throw error;
    }
  }

  async reset(userForm: FormGroup): Promise<void> {
    // Retrieving identifier and requestID from the store
    const request = this.authOtpStore.get(this.authRequestKey);

    try {
      // Call the API to finalize the request and set the new password
      await firstValueFrom(
        this.authService.resetForgottenPassword(
          {
            otp_request_id: request?.requestID,
            user_id: request?.identifier,
            password: userForm.get('password-feedback')?.value,
            confirmation: userForm.get('confirmation')?.value,
          }
        )
      )

      // Redirect to the auth page and show a success notification
      this.router.navigate(['/auth']).then(() => {
        this.notificationService.showToastSuccess('auth.otp-flow.password.messages.reset-success')
      })
    } catch (error) {
      // Rethrow the error to the caller
      throw error;
    }
  }

  protected readonly AuthRequestKey = AuthRequestKey;
}
