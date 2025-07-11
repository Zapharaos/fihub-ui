import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "@shared/services/notification.service";
import {FormService} from "@shared/services/form.service";
import {
  ModelsPermission,
  SecurityService,
  ModelsRoleWithPermissions,
  UserService,
} from "@core/api";
import {Message} from "primeng/message";
import {NgForOf, NgIf} from "@angular/common";
import {InputText} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {finalize, firstValueFrom} from "rxjs";
import {handleErrors, ResponseError} from "@shared/utils/errors";
import {applyFilterGlobal} from "@shared/utils/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {RoleStore} from "@modules/dashboard/admin/roles/stores/role.service";
import {notEmptyValidator} from "@shared/validators/array";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-admin-roles-form-layout',
  imports: [
    Button,
    ReactiveFormsModule,
    Ripple,
    TranslatePipe,
    Message,
    NgIf,
    InputText,
    NgForOf,
    PrimeTemplate,
    Skeleton,
    TableModule,
    IconField,
    InputIcon
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  protected readonly nameLengthMin = 3;
  protected readonly tablePropertiesFilter = ['value', 'scope', 'description'];

  isCreateForm = true;
  loading = true;
  permissions: ModelsPermission[] = [];
  role: ModelsRoleWithPermissions = {};
  submitLabel = '';
  submitIcon = '';
  showSelectedPermissionsOnly = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    protected formService: FormService,
    private securityService: SecurityService,
    private userService: UserService,
    private roleStore: RoleStore,
    private authService: AuthService,
  ) {

    // Retrieve role ID
    const roleID = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isCreateForm = roleID === undefined;

    // Init form
    this.formService.init(this.fb.group({
      name: ['', [Validators.minLength(this.nameLengthMin), Validators.required]],
      permissions: [this.role.permissions, notEmptyValidator()]
    }));

    // Set form submit label
    if (this.isCreateForm) {
      this.submitLabel = 'admin.roles.form.label.submit-add';
      this.submitIcon = 'pi-plus';
    } else {
      this.submitLabel = 'admin.roles.form.label.submit-update';
      this.submitIcon = 'pi-check';

      this.loadRole();
    }
  }

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.loading = true;
    this.securityService.listPermissions().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (permissions: ModelsPermission[]) => {
        this.permissions = permissions;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  loadRole() {
    // Retrieve role data
    const role = this.roleStore.role;

    // If the role is already loaded
    if (role) {
      this.role = role;
      this.patchForm();
      return;
    }

    // If the role is not loaded, then retrieve it from the API
    const roleID = this.route.snapshot.paramMap.get('id');
    this.securityService.getRole(roleID!).subscribe({
      next: (role: ModelsRoleWithPermissions) => {
        this.roleStore.role = role;
        this.role = role;
        this.patchForm();
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
        // Could not retrieve the role : nothing to do on this page
        this.router.navigate(['/dashboard/admin/roles']);
      }
    })
  }

  // Roles

  createRole(role: ModelsRoleWithPermissions) {
    this.loading = true;
    this.securityService.createRole(role).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (r: ModelsRoleWithPermissions) => {
        // Success : navigate back to the roles page
        this.router.navigate(['/dashboard/admin/roles']).then(() => {
          this.notificationService.showToastSuccess('admin.roles.messages.create-success', {name: r.name});
        })
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleErrors400.bind(this));
      }
    })
  }

  updateRole(role: ModelsRoleWithPermissions) {
    this.loading = true;
    this.securityService.updateRole(role.id!, role).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (r: ModelsRoleWithPermissions) => {
        // Success : navigate back to the roles page
        firstValueFrom(this.userService.listRolesWithPermissionsForUser(this.authService.currentUser?.ID ?? '')).then((roles) => {
          this.authService.setCurrentUserRoles(roles);
          this.authService.setLoaded(true);
          this.router.navigate(['/dashboard/admin/roles']).then(() => {
            this.notificationService.showToastSuccess('admin.roles.messages.update-success', {name: r.name});
          })
        });
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleErrors400.bind(this));
      }
    })
  }

  // Form

  submit() {
    // Skip if form invalid
    if (this.formService.isInvalid()) {
      return;
    }

    const role: ModelsRoleWithPermissions = {
      id: this.role.id,
      name: this.formService.getFormValue().name,
      permissions: this.formService.getFormValue().permissions,
    }

    // Call API
    if (this.isCreateForm) {
      this.createRole(role);
    } else {
      this.updateRole(role);
    }
  }

  patchForm() {
    this.formService.patchValue({
      name: this.role.name,
      permissions: this.role.permissions
    });
  }

  // Errors

  handleErrors400(error: ResponseError) {
    switch (error.message) {
      case 'name-required':
      case 'name-invalid':
        this.formService.setFieldErrors('name', ['submit-invalid']);
        break;
      case 'permissions-limit-exceeded':
        this.notificationService.showToastError('admin.roles.form.error.permissions-limit', {limit: 250});
        break;
      default:
        this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
        break;
    }
  }

  // Table

  onRowSelect(event: TableRowSelectEvent) {
    if (!this.role.permissions?.some(p => p.id === event.data.id)) {
      this.role.permissions?.push(event.data);
    }
    this.formService.setControlValue('permissions', this.role.permissions, true);
  }

  onRowUnselect(event: TableRowSelectEvent) {
    this.role.permissions = this.role.permissions?.filter(p => p.id !== event.data.id);
    this.formService.setControlValue('permissions', this.role.permissions, true);
  }

  onHeaderCheckboxToggle(event: { checked: boolean }) {
    if (event.checked) {
      this.role.permissions = this.permissions;
    } else {
      this.role.permissions = [];
    }
    this.formService.setControlValue('permissions', this.role.permissions);
  }

  toggleSelectedPermissionsOnly() {
    this.showSelectedPermissionsOnly = !this.showSelectedPermissionsOnly;
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
