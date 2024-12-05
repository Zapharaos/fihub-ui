import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {MessagesModule} from "primeng/messages";
import {PasswordModule} from "primeng/password";
import {Message, PrimeTemplate} from "primeng/api";
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
    MessagesModule,
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
  @Output() onSubmit = new EventEmitter();

  loading = false;
  error = false;
  messages: Message[] = [];
  userForm: FormGroup = this.fb.group({});

  // TODO : loading, toast, errors, redirects, links

  constructor(
    private fb: FormBuilder,
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
      this.userForm.addControl('email', new FormControl({
        value: this.user.email,
        disabled: this.loading
        }, [
          Validators.email,
          Validators.required,
        ]
      ));
    }

    // Password
    if (this.fieldPassword) {
      this.userForm.addControl('password', new FormControl({
        value: this.user.password,
        disabled: this.loading
      }, [
        Validators.required
      ]));
    }

    // Password Feedback
    if (this.fieldPasswordFeedback) {
      this.userForm.addControl('password-feedback', new FormControl({
        value: this.user.password,
        disabled: this.loading
      }, [
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.required,
      ]));
    }

    // Confirmation
    if (this.fieldConfirmation) {

      this.userForm.addControl('confirmation', new FormControl({
        value: this.user.confirmation,
        disabled: this.loading
      }, [
        Validators.required,
      ]));

      // Validate that confirmation corresponds to the password
      this.userForm.addValidators(this.passwordMatchValidator('password-feedback', 'confirmation'))
    }

    // Checkbox
    if (this.fieldCheckbox) {
      this.userForm.addControl('checkbox', new FormControl({
        value: this.user.checkbox,
        disabled: this.loading
      }, [
        Validators.requiredTrue,
      ]));
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
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }
}
