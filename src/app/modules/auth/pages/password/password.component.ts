import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {Router} from "@angular/router";
import {AuthService, ModelsResponseUserOtp, ModelsUserInputPassword} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {FormGroup} from "@angular/forms";
import {finalize} from "rxjs";
import {PasswordStoreStep, PasswordStore} from "@modules/auth/stores/password.service";
import {LanguageService} from "@shared/services/language.service";

@Component({
  selector: 'app-password',
  imports: [
    AuthFormComponent
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent implements OnInit {

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

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private passwordStore: PasswordStore,
    private languageService: LanguageService,
  ) {
  }

  ngOnInit() {
    this.passwordStore.request$.subscribe((request) => {
      if (request) {
        this.updateStep(request.step);
      }
    });

    this.passwordStore.init();
  }

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
    this.authService.generateForgottenPasswordOTP(
      {
        email: userForm.value.email,
      },
      this.languageService.language?.code
    ).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (request: ModelsResponseUserOtp) => {

        // Success : store request into next step
        this.passwordStore.request = {
          userID: request.identifier || '',
          expiresAt: request.expires_at || '',
          requestID: '',
          step: PasswordStoreStep.Verify,
        }

        // A request is already active
        if (request.error === 'request-active') {
          this.notificationService.showToastWarn('auth.password.messages.request-active');
        } else {
          this.notificationService.showToastSuccess('auth.password.messages.send-success');
        }
      },
      error: (error: Error) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    });
  }

  verify(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);
    this.authService.validateForgottenPasswordOTP(
      {
        otp: userForm.value.otp,
        user_id: this.passwordStore.request?.userID,
      },
    ).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (requestID: string) => {
        // Success : store requestID into next step
        const copyStore = this.passwordStore.request;
        if (copyStore) {
          copyStore.requestID = requestID;
          copyStore.step = PasswordStoreStep.Reset;
          this.passwordStore.request = copyStore;
        }
      },
      error: (error: Error) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    });
  }

  reset(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);

    // Retrieving userID and requestID from the store
    const request = this.passwordStore.request;

    // Reset the password
    this.authService.resetForgottenPassword(
      {
        otp_request_id: request?.requestID,
        user_id: request?.userID,
        password: userForm.get('password-feedback')?.value,
        confirmation: userForm.get('confirmation')?.value,
      }
    ).pipe(finalize(() => {
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        this.passwordStore.reset();
        // Success : navigate to login page
        this.router.navigate(['/auth']).then(() => {
          this.notificationService.showToastSuccess('auth.password.messages.reset-success')
        })
      },
      error: (error: Error) => {
        // An error has occurred
        this.authFormComponent.handleError(error)
      },
    });
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
}
