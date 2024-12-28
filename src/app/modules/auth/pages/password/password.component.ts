import {Component, ViewChild} from '@angular/core';
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {Router} from "@angular/router";
import {UsersService} from "@core/api";
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

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private usersService: UsersService,
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
    // this.authFormComponent.setLoading(true);
    this.activeConfig = this.formConfigVerification;
    this.authFormComponent.setConfig(this.formConfigVerification);
  }

  verify(userForm: FormGroup) {
    // this.authFormComponent.setLoading(true);
    this.activeConfig = this.formConfigReset;
    this.authFormComponent.setConfig(this.formConfigReset);
  }

  reset(userForm: FormGroup) {
    // this.authFormComponent.setLoading(true);
  }
}
