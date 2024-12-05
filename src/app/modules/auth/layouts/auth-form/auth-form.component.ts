import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {MessagesModule} from "primeng/messages";
import {PasswordModule} from "primeng/password";
import {Message, PrimeTemplate} from "primeng/api";
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
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
    CheckboxModule
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent {
  @Input() title: string = "";
  @Input() user: FormUser = {};
  @Input() fieldEmail: boolean = false;
  @Input() fieldPassword: boolean = false;
  @Input() fieldPasswordFeedback: boolean = false;
  @Input() fieldConfirmation: boolean = false;
  @Input() fieldCheckbox: string = "";
  @Input() fieldSubmit: string = "";
  @Input() isSubmitDisabled: () => boolean = () => true;
  @Output() onSubmit = new EventEmitter();

  loading = false;
  error = false;
  messages: Message[] = [];
  // userForm: FormGroup = this.fb.group({});

  constructor(
    // private fb: FormBuilder,
  ) {
    // this.initFormControls()
  }

  onSubmitWrapper() {
    this.onSubmit.emit();
  }

  /*initFormControls() {
    // const formControls: { [key: string]: [any, ValidatorFn[] | ValidationErrors] } = {};

    // Email
    if (this.fieldEmail) {
      this.userForm.addControl('email', new FormControl('', Validators.required));
      // formControls['email'] = [this.user.email, Validators.required];
    }
    // Password
    if (this.fieldPassword) {
      this.userForm.addControl('password', new FormControl('', Validators.required));
      // formControls['password'] = [this.user.password, Validators.required];
    }
    // Password Feedback
    if (this.fieldPasswordFeedback) {
      this.userForm.addControl('password', new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]));
      // formControls['password'] = [this.user.password, Validators.required, Validators.minLength(8), Validators.maxLength(64)];
    }
    // Confirmation
    if (this.fieldConfirmation) {

      const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
        return this.user.password === control.value ? null : { passwordMismatch: true };
      };

      this.userForm.addControl('confirmation', new FormControl('', [
        Validators.required,
        passwordMatchValidator
      ]));
      // formControls['confirmation'] = [this.user.confirmation, Validators.required, passwordMatchValidator];
    }
    // Checkbox
    if (this.fieldCheckbox) {
      this.userForm.addControl('checkbox', new FormControl('', [
        Validators.requiredTrue
      ]));
      // formControls['checkbox'] = [this.user.checkbox, Validators.requiredTrue];
    }

    // this.userForm = this.fb.group(formControls);
  }*/
}
