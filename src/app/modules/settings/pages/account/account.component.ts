import {Component, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@shared/services/notification.service";
import {TranslatePipe} from "@ngx-translate/core";
import {UserService, ModelsUser} from "@core/api";
import {handleErrors} from "@shared/utils/errors";
import {DialogMode, DialogService} from "@shared/services/dialog.service";
import {ConfirmService} from "@shared/services/confirm.service";
import {Dialog} from "primeng/dialog";
import {NgTemplateOutlet} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthFormComponent, AuthFormFieldConfig} from "@shared/components/auth-form/auth-form.component";
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
    ReactiveFormsModule,
    AuthFormComponent,
    NgTemplateOutlet,
    DashboardContentLayoutComponent,
    Divider,
    RouterLink,
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

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  // Global
  loading = false;
  user = this.authService.currentUser;

  // Dialog
  dialogVisible = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    protected dialogService: DialogService,
    protected formService: FormService,
  ) {

    this.dialogService.init([
      {
        status: DialogMode.UPDATE,
        titleLabel: 'settings.account.actions.update-details',
        submitLabel: 'actions.update',
        action: () => this.authFormComponent.onSubmitWrapper(),
      },
      {
        status: DialogMode.PASSWORD,
        titleLabel: 'settings.account.actions.change-password',
        submitLabel: 'actions.update',
        action: () => this.authFormComponent.onSubmitWrapper(),
      },
    ]);

    this.dialogService.dialogVisibilityChange.subscribe((isVisible: boolean) => {
      this.dialogVisible = isVisible;
    });
  }

  // Dialog

  closeDialog() {
    this.dialogService.close();
    this.formService.reset();
  }

  // Form

  submitForm(userForm: FormGroup) {
    if (this.dialogService.isActive(DialogMode.UPDATE)) {
      this.updateUserDetails(userForm);
    }
  }

  // Actions

  onEditUserDetails() {
    this.dialogService.open(DialogMode.UPDATE);
    this.authFormComponent.setConfig(this.formConfigUserDetails);
    this.authFormComponent.patchUserFormServiceValue(this.user!);
  }

  onDelete(event: Event) {
    this.confirmService.showDeleteConfirmation({
      event: event,
      accept: () => this.deleteAccount(),
    });
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
    this.userService.updateUserSelf(userForm.value).pipe(finalize(() => {
      // Call is over
      this.authFormComponent.setLoading(false)
    })).subscribe({
      next: (user: ModelsUser) => {
        // Update local user
        this.user = user;
        this.authService.currentUser = user;
        // Clean up
        this.notificationService.showToastSuccess('auth.messages.update-success')
        this.closeDialog();
      },
      error: (error: Error) => {
        this.authFormComponent.handleError(error)
      },
    })
  }

  deleteAccount() {
    this.userService.deleteUserSelf().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/']).then(() => {
          this.notificationService.showToastSuccess('auth.messages.delete-success')
        });
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    });
  }
}
