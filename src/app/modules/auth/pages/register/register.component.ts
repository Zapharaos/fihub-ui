import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {AuthService} from "@core/api";
import {FormGroup} from "@angular/forms";
import {NotificationService} from "@shared/services/notification.service";
import {AuthFlowComponent, AuthFlowStep} from "@shared/components/auth-flow/auth-flow.component";
import {AuthOtpStore, AuthRequestKey} from "@shared/stores/auth-otp.service";
import {LanguageService} from "@shared/services/language.service";

@Component({
    selector: 'app-register',
  imports: [
    AuthFlowComponent
  ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

  protected readonly authRequestKey: AuthRequestKey = AuthRequestKey.RegisterUser;
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
        checkboxLabel: "auth.register.agreement",
        submitLabel: "auth.register.submit",
      },
      onSubmit: (form: FormGroup) => this.register(form),
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private authOtpStore: AuthOtpStore,
    private languageService: LanguageService,
  ) { }

  async forgot(userForm: FormGroup): Promise<void> {
    try {
      // Call the API to generate a user signup OTP
      const request = await firstValueFrom(
        this.authService.generateSignupOTP(
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
      // Call the API to validate the user signup OTP
      // & store the request ID for the next step
      const request = await firstValueFrom(
        this.authService.validateSignupOTP(
          {
            otp: userForm.value.otp,
            identifier: this.authOtpStore.get(this.authRequestKey)?.identifier,
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

  async register(userForm: FormGroup): Promise<void> {
    // Retrieving identifier and requestID from the store
    const request = this.authOtpStore.get(this.authRequestKey);

    try {
      // Call the API to finalize the request and register the user
      await firstValueFrom(
        this.authService.registerUser(
          {
            otp_request_id: request?.requestID,
            email: request?.identifier,
            password: userForm.get('password-feedback')?.value,
            confirmation: userForm.get('confirmation')?.value,
            checkbox: userForm.get('checkbox')?.value,
          }
        )
      )

      // Redirect to the auth page and show a success notification
      this.router.navigate(['/auth']).then(() => {
        this.notificationService.showToastSuccess('auth.messages.register-success', {email: request?.identifier})
      })
    } catch (error) {
      // Rethrow the error to the caller
      throw error;
    }
  }
}
