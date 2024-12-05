import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {PrimeTemplate} from "primeng/api";
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
import {TranslatePipe} from "@ngx-translate/core";
import {NgClass, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {CheckboxModule} from "primeng/checkbox";
import {FormUser} from "@shared/models/form-user";

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
    NgClass,
    DividerModule,
    CheckboxModule,
    ButtonDirective
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit {
  @Input() title: string = "";
  @Input() user: FormUser = {};
  @Input() fieldEmail: boolean = false;
  @Input() fieldPassword: boolean = false;
  @Input() fieldPasswordFeedback: boolean = false;
  @Input() fieldConfirmation: boolean = false;
  @Input() fieldCheckbox: string = "";
  @Input() fieldSubmit: string = "";
  @Input() loading = false;
  @Output() onSubmit = new EventEmitter();

  userForm: FormGroup = this.fb.group({});
  error = false;

  // TODO : links
  // TODO : API errors

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    // Form controls depends on the @Input fields which have yet to be passed in the constructor
    this.initFormControls();
  }

  onSubmitWrapper() {
    this.onSubmit.emit();
  }

  initFormControls() {
    // Email
    if (this.fieldEmail) {
      this.userForm.addControl('email', new FormControl(this.user.email,
        [
          Validators.email,
          Validators.required,
        ]
      ));
    }

    // Password
    if (this.fieldPassword) {
      this.userForm.addControl('password', new FormControl(this.user.password,
        [
          Validators.required
        ]
      ));
    }

    // Password Feedback
    if (this.fieldPasswordFeedback) {
      this.userForm.addControl('password-feedback', new FormControl(this.user.password,
        [
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.required,
        ]
      ));
    }

    // Confirmation
    if (this.fieldConfirmation) {

      this.userForm.addControl('confirmation', new FormControl(this.user.confirmation,
        [
          Validators.required,
        ]
      ));

      // Validate that confirmation corresponds to the password
      this.userForm.addValidators(this.passwordMatchValidator('password-feedback', 'confirmation'))
    }

    // Checkbox
    if (this.fieldCheckbox) {
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
