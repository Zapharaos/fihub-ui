import {Component, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@shared/services/notification.service";
import {TranslatePipe} from "@ngx-translate/core";
import {UsersService, UsersUser, UsersUserInputPassword} from "@core/api";
import {handleErrors} from "@shared/utils/errors";
import {DialogMode, DialogService} from "@shared/services/dialog.service";
import {ConfirmService} from "@shared/services/confirm.service";
import {Dialog} from "primeng/dialog";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthFormComponent, AuthFormFieldConfig} from "@modules/auth/layouts/auth-form/auth-form.component";
import {FormService} from "@shared/services/form.service";
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Divider} from "primeng/divider";
import {finalize} from "rxjs";

@Component({
    selector: 'app-account',
  imports: [
    Button,
    TranslatePipe,
    Dialog,
    NgIf,
    ReactiveFormsModule,
    AuthFormComponent,
    NgTemplateOutlet,
    DashboardContentLayoutComponent,
    Divider,
  ],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {

  protected readonly formConfigUserDetails: AuthFormFieldConfig = {
    hasEmail: true,
    cssFormRaw: true,
    hideImage: true,
    hideActions: true,
  };

  protected readonly formConfigUserPassword: AuthFormFieldConfig = {
    hasPasswordFeedback: true,
    hasConfirmation: true,
    cssFormRaw: true,
    hideImage: true,
    hideActions: true,
    hidePwdSuggestions: true,
  };

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  // Global
  loading: boolean = false;
  user = this.authService.currentUser;

  // Dialog
  dialogVisible: boolean = false;
  isDetails: boolean = false;
  isPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    protected dialogService: DialogService,
    protected formService: FormService,
  ) {

    this.dialogService.dialogVisibilityChange.subscribe((isVisible: boolean) => {
      this.dialogVisible = isVisible;
    });

    this.dialogService.setDialogPropsUpdate(() => this.authFormComponent.onSubmitWrapper());
  }

  // Dialog

  closeDialog() {
    this.dialogService.closeDialog();
    this.formService.reset();
    this.isDetails = false;
    this.isPassword = false;
  }

  // Actions

  onEditUserDetails() {
    this.dialogService.openDialog(DialogMode.UPDATE);
    this.authFormComponent.patchUserFormServiceValue(this.user!);
    this.isDetails = true;
  }

  onEditUserPassword() {
    // TODO: Implement password change
    this.dialogService.openDialog(DialogMode.UPDATE);
    this.isPassword = true;
  }

  onDelete(event: Event) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteAccount());
  }

  // User

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      this.notificationService.showToastSuccess('auth.messages.logout-success')
    });
  }

  updateUserDetails(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);

    // Calling service to update the user details
    this.usersService.updateUserSelf(userForm.value).pipe(finalize(() => {
      // Call is over
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (user: UsersUser) => {
        // Update local user
        this.user = user;
        this.authService.currentUser = user;
        // Clean up
        this.notificationService.showToastSuccess('auth.messages.update-success')
        this.closeDialog();
      },
      error: (error: any) => {
        this.authFormComponent.handleError(error)
      },
    })
  }

  updateUserPassword(userForm: FormGroup) {
    this.authFormComponent.setLoading(true);

    // Retrieving user through Form
    const user : UsersUserInputPassword = {
      password: userForm.get('password-feedback')?.value,
      confirmation: userForm.get('confirmation')?.value,
    }

    // Calling service to update the user details
    this.usersService.changeUserPassword(user).pipe(finalize(() => {
      // Call is over
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: () => {
        // Clean up
        this.notificationService.showToastSuccess('auth.messages.update-success')
        this.closeDialog();
      },
      error: (error: any) => {
        this.authFormComponent.handleError(error)
      },
    })
  }

  deleteAccount() {
    this.usersService.deleteUserSelf().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/']).then(() => {
          this.notificationService.showToastSuccess('auth.messages.delete-success')
        });
      },
      error: (error: any) => {
        handleErrors(error, this.notificationService);
      }
    });
  }

}
