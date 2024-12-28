import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import { Message } from 'primeng/message';
import {PrimeTemplate} from "primeng/api";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {NgClass, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {CheckboxModule} from "primeng/checkbox";
import {MessagesModule} from 'primeng/messages';
import {UsersUserInputCreate} from "@core/api";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {passwordMatchValidator} from "@shared/validators/password-match";
import {FormService} from "@shared/services/form.service";

export type AuthFormFieldConfig = {
  hasEmail?: boolean;
  hasEmailControl?: boolean;
  hasPassword?: boolean;
  hasPasswordFeedback?: boolean;
  hasConfirmation?: boolean;
  checkboxLabel?: string;
  submitLabel?: string;
  hasLoginLink?: boolean,
  hasRegisterLink?: boolean,
  hasForgotLink?: boolean,
  cssFormRaw?: boolean,
  hideImage?: boolean;
  hideActions?: boolean;
  hidePwdSuggestions?: boolean;
};

@Component({
    selector: 'app-auth-form',
  imports: [
    Button,
    CardModule,
    InputTextModule,
    PasswordModule,
    PrimeTemplate,
    ReactiveFormsModule,
    Ripple,
    RouterLink,
    TranslatePipe,
    NgIf,
    FormsModule,
    DividerModule,
    CheckboxModule,
    ButtonDirective,
    MessagesModule,
    Message,
    InputIcon, IconField, NgClass
  ],
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit {
  @Input() title?: string | undefined;
  @Input() fieldConfig: AuthFormFieldConfig = {};
  @Output() onSubmit = new EventEmitter<FormGroup>();

  protected readonly logoPath = "assets/svg/logo-initial.svg";
  user: UsersUserInputCreate = {};
  loading = false;
  messageError: string = "";

  constructor(
    private translateService: TranslateService,
    protected formService: FormService
  ) {  }

  ngOnInit() {
    // Can't have default password field AND password field with feedback at the same time
    if (this.fieldConfig.hasPassword && this.fieldConfig.hasPasswordFeedback) {
      throw new Error("Can't have both fieldConfig.hasPassword and fieldConfig.hasPasswordFeedback set to true");
    }

    // Form controls depends on the @Input fields which have yet to be passed in the constructor
    this.initFormControls();
  }

  onSubmitWrapper() {
    // Skip if form invalid
    if (this.formService.isInvalid()) {
      return
    }
    // Emit submit event back to parent
    this.onSubmit.emit(this.formService.getForm());
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setConfig(fieldConfig: AuthFormFieldConfig) {
    this.fieldConfig = fieldConfig;
    this.initFormControls();
  }

  handleError(error: any) {

    // Clear messageError
    this.messageError = "";

    // Handle 400 Bad Request error
    if (error.status === 400) {
      switch (error.error.message) {

        // Login credentials - Invalid
        case 'login-invalid':
          this.messageError = this.translateService.instant('auth.form.error.login');
          break;

        // Email - Default
        case 'email-required':
        case 'email-invalid':
          this.formService.setFieldErrors('email', ['submit-required']);
          break;

        // Email - Used
        case 'email-used':
          this.formService.setFieldErrors('email', ['submit-used']);
          break;

        // Password - Default
        case 'password-required':
        case 'password-invalid':
          if (this.fieldConfig.hasPassword) {
            this.formService.setFieldErrors('password', ['submit-required']);
          } else if (this.fieldConfig.hasPasswordFeedback){
            this.formService.setFieldErrors('password-feedback', ['submit-required']);
          }
          break;

        // Confirmation - Default
        case 'confirmation-required':
        case 'confirmation-invalid':
          this.formService.setFieldErrors('confirmation', ['submit-required']);
          break;

        // Checkbox - Default
        case 'checkbox-invalid':
          this.formService.setFieldErrors('checkbox', ['submit-invalid']);
          break;

        // Generic error
        default:
          this.messageError = this.translateService.instant('http.500.detail');
      }
    } else {
      // Likely 500 InternalServerError - Generic enough to handle all other possible errors
      this.messageError = this.translateService.instant('http.500.detail');
    }
  }

  initFormControls() {
    // Clear form service from any previous use
    this.formService.clear();

    // Email
    if (this.fieldConfig.hasEmail && this.fieldConfig.hasEmailControl) {
      // Checking email format for input
      this.formService.addControlPostEmail('email', this.user.email);
    } else if (this.fieldConfig.hasEmail) {
      this.formService.addControlRequired('email', this.user.email);
    }

    // Password
    if (this.fieldConfig.hasPassword) {
      this.formService.addControlRequired('password', this.user.password);
    }

    // Password Feedback
    if (this.fieldConfig.hasPasswordFeedback) {
      this.formService.addControlPostPassword('password-feedback', this.user.password);
    }

    // Confirmation
    if (this.fieldConfig.hasConfirmation) {
      this.formService.addControlRequired('confirmation', this.user.confirmation);

      // Validate that confirmation corresponds to the password
      this.formService.addFormValidators(passwordMatchValidator('password-feedback', 'confirmation'))
    }

    // Checkbox
    if (this.fieldConfig.checkboxLabel) {
      this.formService.addControlCheckbox('checkbox', this.user.checkbox);
    }
  }

  patchUserFormServiceValue(user: UsersUserInputCreate) {
    this.user = {...user};
    this.formService.patchValue(user);
  }

}
