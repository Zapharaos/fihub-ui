import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {Message, MessageService, PrimeTemplate} from "primeng/api";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {CheckboxModule} from "primeng/checkbox";
import {MessagesModule} from 'primeng/messages';
import {UsersUserWithPassword} from "@core/api";

export type AuthFormFieldConfig = {
  hasEmail?: boolean;
  hasEmailControl?: boolean;
  hasPassword?: boolean;
  hasPasswordFeedback?: boolean;
  hasConfirmation?: boolean;
  checkboxLabel?: string;
  submitLabel: string;
  hasLoginLink?: boolean,
  hasRegisterLink?: boolean,
  hasForgotLink?: boolean,
};

export interface FormUser extends UsersUserWithPassword {
  confirmation?: string;
  checkbox?: string;
}

@Component({
  selector: 'app-auth-form',
  standalone: true,
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
    MessagesModule
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit {
  @Input() title: string = "";
  @Input() fieldConfig: AuthFormFieldConfig = {submitLabel: ""};
  @Output() onSubmit = new EventEmitter<FormGroup>();

  user: FormUser = {};
  userForm: FormGroup = this.fb.group({});
  loading = false;
  messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    // Form controls depends on the @Input fields which have yet to be passed in the constructor
    this.initFormControls();
  }

  onSubmitWrapper() {
    // Emit submit event back to parent
    this.onSubmit.emit(this.userForm);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  handleError(error: any) {
    // Handle 400 Bad Request error
    if (error.status === 400) {
      switch (error.error.message) {

        // Email - Default
        case 'email-required':
        case 'email-invalid':
          this.userForm.get('email')?.setErrors({ 'required': true });
          break;

        // Email - Used
        case 'email-used':
          this.userForm.get('email')?.setErrors({ 'used': true });
          break;

        // Password - Default
        case 'password-required':
        case 'password-invalid':
          this.userForm.get('password')?.setErrors({ 'required': true });
          break;

        // Generic error
        default:
          this.messages = [({
            severity: 'error',
            detail: this.translateService.instant('http.500.detail')
          })];
      }
    } else {
      // Likely 500 InternalServerError - Generic enough to handle all other possible errors
      this.messages = [({
        severity: 'error',
        detail: this.translateService.instant('http.500.detail')
      })];
    }
  }

  initFormControls() {
    // Email
    if (this.fieldConfig.hasEmail) {
      this.userForm.addControl('email', new FormControl(this.user.email,
        [
          Validators.required,
        ]
      ));

      // Checking email format
      if (this.fieldConfig.hasEmailControl) {
        this.userForm.get('email')?.addValidators(Validators.email);
      }
    }

    // Password
    if (this.fieldConfig.hasPassword) {
      this.userForm.addControl('password', new FormControl(this.user.password,
        [
          Validators.required
        ]
      ));
    }

    // Password Feedback
    if (this.fieldConfig.hasPasswordFeedback) {
      this.userForm.addControl('password-feedback', new FormControl(this.user.password,
        [
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.required,
        ]
      ));
    }

    // Confirmation
    if (this.fieldConfig.hasConfirmation) {

      this.userForm.addControl('confirmation', new FormControl(this.user.confirmation,
        [
          Validators.required,
        ]
      ));

      // Validate that confirmation corresponds to the password
      this.userForm.addValidators(this.passwordMatchValidator('password-feedback', 'confirmation'))
    }

    // Checkbox
    if (this.fieldConfig.checkboxLabel) {
      this.userForm.addControl('checkbox', new FormControl(this.user.checkbox,
        [
          Validators.requiredTrue,
        ]
      ));
    }
  }

  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = {confirmedValidator: 'Passwords do not match.'};
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }
}
