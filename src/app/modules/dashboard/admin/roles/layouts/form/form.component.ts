import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "@shared/services/notification.service";
import {FormService} from "@shared/services/form.service";
import {
  PermissionsPermission,
  PermissionsService,
  RolesRole, RolesRoleWithPermissions,
  RolesService,
} from "@core/api";
import {Message} from "primeng/message";
import {NgForOf, NgIf} from "@angular/common";
import {InputText} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {finalize} from "rxjs";
import {handleErrors, ResponseError} from "@shared/utils/errors";
import {applyFilterGlobal, multipleSortWithTableCheckbox} from "@shared/utils/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";

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
  permissions!: PermissionsPermission[];
  role: RolesRoleWithPermissions = {};
  submitLabel = '';
  submitIcon = '';
  showSelectedPermissionsOnly = false;

  // TODO : update : retrieve role and permissions from API
  // TODO : update : filter by selected

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    protected formService: FormService,
    private permissionsService: PermissionsService,
    private roleService: RolesService,
  ) {

    // Retrieve role ID
    const roleID = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isCreateForm = roleID === undefined;

    // Set form submit label
    if (this.isCreateForm) {
      this.submitLabel = 'admin.roles.form.label.submit-add';
      this.submitIcon = 'pi-plus';
    } else {
      this.submitLabel = 'admin.roles.form.label.submit-update';
      this.submitIcon = 'pi-check';
    }

    // Init form
    this.formService.init(this.fb.group({
      name: ['', [Validators.minLength(this.nameLengthMin), Validators.required]],
    }));
  }

  ngOnInit() {
    this.loadPermissions();
  }

  // Permissions

  loadPermissions() {
    this.loading = true;
    this.permissionsService.getPermissions().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (permissions: PermissionsPermission[]) => {
        this.permissions = permissions;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  // Roles

  createRole(role: RolesRoleWithPermissions) {
    this.loading = true;
    this.roleService.createRole(role).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (r: RolesRole) => {
        this.notificationService.showToastSuccess('admin.roles.messages.create-success', {name: r.name});
        this.setPermissions(r, role.permissions ?? []);
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleErrors400.bind(this));
      }
    })
  }

  updateRole(role: RolesRoleWithPermissions) {
    this.loading = true;
    this.roleService.updateRole(role.id!, role).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (r: RolesRole) => {
        this.notificationService.showToastSuccess('admin.roles.messages.update-success', {name: r.name});
        this.setPermissions(r, role.permissions ?? []);
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleErrors400.bind(this));
      }
    })
  }

  // Role permissions

  setPermissions(role: RolesRole, permissions: PermissionsPermission[]) {
    this.loading = true;
    this.roleService.getRolePermissions(role.id!).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        // Success : navigate back to the roles page
        this.router.navigate(['/dashboard/admin/roles']);
      },
      error: (error: Error) => {
        this.notificationService.showToastError('admin.roles.messages.permissions.set-error');
      }
    })
  }

  // Form

  submit() {
    // Skip if form invalid
    if (this.formService.isInvalid()) {
      return;
    }

    const role: RolesRoleWithPermissions = {
      name: this.formService.getFormValue().name,
      permissions: this.role.permissions,
    }

    // Call API
    if (!this.role) {
      this.updateRole(role);
    } else {
      this.createRole(role);
    }
  }

  // Errors

  handleErrors400(error: ResponseError) {
    switch (error.message) {
      case 'name-required':
      case 'name-invalid':
        this.formService.setFieldErrors('name', ['submit-invalid']);
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
  }

  toggleSelectedPermissionsOnly() {
    this.showSelectedPermissionsOnly = !this.showSelectedPermissionsOnly;
  }

  protected readonly multipleSortWithTableCheckbox = multipleSortWithTableCheckbox;
  protected readonly applyFilterGlobal = applyFilterGlobal;
}
