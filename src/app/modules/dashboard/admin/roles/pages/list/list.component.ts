import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {Table, TableModule} from "primeng/table";
import {NotificationService} from "@shared/services/notification.service";
import {PrimeTemplate} from "primeng/api";
import {
  RolesRoleWithPermissions,
  RolesService
} from "@core/api";
import {finalize} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/fileupload";
import {NgForOf, NgIf} from "@angular/common";
import {ConfirmService} from "@shared/services/confirm.service";
import {FormService} from "@shared/services/form.service";
import {handleErrors} from "@shared/utils/errors";
import {Skeleton} from "primeng/skeleton";
import {Router, RouterLink} from "@angular/router";
import {RoleStore} from "@modules/dashboard/admin/roles/stores/role.service";
import {RoleService, Role} from "@modules/dashboard/admin/roles/services/roles.service";

@Component({
    selector: 'app-admin-roles',
  imports: [
    DashboardContentLayoutComponent,
    IconField,
    InputIcon,
    InputText,
    TranslatePipe,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    FileUploadModule,
    Skeleton,
    NgForOf,
    Button,
    RouterLink,
    NgIf,
  ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  // Global
  loading = true;

  // Table
  role!: Role
  roles: Role[] = []
  @ViewChild('dt') dt: Table | undefined;

  protected readonly tablePropertiesFilter = ['name', 'permissionValues'];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    protected formService: FormService,
    private rolesService: RolesService,
    private roleService: RoleService,
    private roleStore: RoleStore,
    private confirmService: ConfirmService,
  ) { }

  ngOnInit() {
    this.loadRoles()
  }

  // Load

  loadRoles() {
    this.loading = true;
    this.roleService.getRolesWithPermissions().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  // Table

  onRowSelect(role: RolesRoleWithPermissions) {
    // Store role
    this.roleStore.role = role;

    // Navigate to update page
    this.router.navigate(['/dashboard/admin/roles', role?.id, 'update']);
  }

  onRowDelete(event: Event, role: RolesRoleWithPermissions) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteRole(role))
  }

  // Roles

  deleteRole(role: RolesRoleWithPermissions) {
    this.loading = true;
    this.rolesService.deleteRole(role.id!).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.loadRoles();
        this.notificationService.showToastSuccess('admin.roles.messages.delete-success', {name: role.name})
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      },
    })
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
