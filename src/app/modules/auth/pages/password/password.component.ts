import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService, ModelsResponseUserOtp} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {FormGroup} from "@angular/forms";
import {PasswordStore} from "@modules/auth/stores/password.service";
import {LanguageService} from "@shared/services/language.service";
import {AuthFlowComponent, AuthFlowStep} from "@shared/components/auth-flow/auth-flow.component";
import {firstValueFrom} from "rxjs";
import {ResponseError} from "@shared/utils/errors";

@Component({
  selector: 'app-password',
  imports: [
    AuthFlowComponent
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {

  steps: AuthFlowStep[] = [
    {
      formConfig: {
        hasEmail: true,
        submitLabel: "auth.password.forgot.submit",
        hasLoginLink: true,
      },
      onSubmit: (form: FormGroup) => this.forgot(form),
    },
    {
      formConfig: {
        hasOtp: true,
        submitLabel: "auth.password.verification.submit",
      },
      onSubmit: (form: FormGroup) => this.verify(form),
    },
    {
      formConfig: {
        hasPasswordFeedback: true,
        hasConfirmation: true,
        submitLabel: "auth.password.reset.submit",
      },
      onSubmit: (form: FormGroup) => this.reset(form),
    }
  ];
  identifier?: string
  expires_at?: string
  request_id?: string

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private passwordStore: PasswordStore,
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

      // Success : store request data
      this.identifier = request.identifier;
      this.expires_at = request.expires_at;

      // Show a notification based on the request status
      if (request.error === 'request-active') {
        this.notificationService.showToastWarn('auth.password.messages.request-active');
      } else {
        this.notificationService.showToastSuccess('auth.password.messages.send-success');
      }

      /*this.passwordStore.request = {
        userID: request.identifier || '',
        expiresAt: request.expires_at || '',
        requestID: '',
        step: PasswordStoreStep.Verify,
      }*/
    } catch (error) {
      // Rethrow the error to the caller : authFormComponent.handleError() will handle it
      throw error;
    }
  }

  async verify(userForm: FormGroup): Promise<void> {
    try {
      // Call the API to validate the forgotten password OTP
      // & store the request ID for the next step
      this.request_id = await firstValueFrom(
        this.authService.validateForgottenPasswordOTP(
          {
            otp: userForm.value.otp,
            user_id: this.identifier,
            // user_id: this.passwordStore.request?.userID,
          },
        )
      );

      /*const copyStore = this.passwordStore.request;
      if (copyStore) {
        copyStore.requestID = requestID;
        copyStore.step = PasswordStoreStep.Reset;
        this.passwordStore.request = copyStore;
      }*/
    } catch (error) {
      // Rethrow the error to the caller : authFormComponent.handleError() will handle it
      throw error;
    }
  }

  async reset(userForm: FormGroup): Promise<void> {
    // Retrieving userID and requestID from the store
    // const request = this.passwordStore.request;

    try {
      // Call the API to finalize the request and set the new password
      await firstValueFrom(
        this.authService.resetForgottenPassword(
          {
            otp_request_id: this.request_id,
            // otp_request_id: request?.requestID,
            user_id: this.identifier,
            // user_id: request?.userID,
            password: userForm.get('password-feedback')?.value,
            confirmation: userForm.get('confirmation')?.value,
          }
        )
      )

      // this.passwordStore.reset();

      // Redirect to the auth page and show a success notification
      this.router.navigate(['/auth']).then(() => {
        this.notificationService.showToastSuccess('auth.password.messages.reset-success')
      })
    } catch (error) {
      // Rethrow the error to the caller : authFormComponent.handleError() will handle it
      throw error;
    }
  }

  /*
  ngOnInit() {
      this.passwordStore.request$.subscribe((request) => {
        if (request) {
          this.updateStep(request.step);
        }
      });

      this.passwordStore.init();
    }

  private updateStep(step: PasswordStoreStep | undefined) {
    // Apply the step (if any)
    switch (step) {
      case PasswordStoreStep.Verify:
        this.activeConfig = this.formConfigVerification;
        this.authFormComponent?.setConfig(this.formConfigVerification);
        break;
      case PasswordStoreStep.Reset:
        this.activeConfig = this.formConfigReset;
        this.authFormComponent?.setConfig(this.formConfigReset);
        break;
      case PasswordStoreStep.Forgot:
      default:
        this.activeConfig = this.formConfigForgot;
        this.authFormComponent?.setConfig(this.formConfigForgot);
        break;
    }
  }
  */
}
