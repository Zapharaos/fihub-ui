import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {Table, TableModule} from "primeng/table";
import {NotificationService} from "@shared/services/notification.service";
import {PrimeTemplate} from "primeng/api";
import {
  BrokerImagesService,
  BrokersBroker,
  BrokersService,
  RolesRole,
  RolesRoleWithPermissions,
  RolesService
} from "@core/api";
import {finalize, forkJoin, map, Observable, switchMap} from "rxjs";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Tag} from "primeng/tag";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {DialogMode, DialogService} from "@shared/services/dialog.service";
import {Dialog} from "primeng/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {ToggleSwitch} from "primeng/toggleswitch";
import {ButtonProps} from "primeng/button/button.interface";
import {ConfirmService} from "@shared/services/confirm.service";
import {FormService} from "@shared/services/form.service";
import {Message} from "primeng/message";
import {BrokerImageService, BrokerWithImage} from "@shared/services/broker-image.service";
import {handleErrors, ResponseError} from "@shared/utils/errors";
import {Skeleton} from "primeng/skeleton";
import {Router, RouterLink} from "@angular/router";


interface Role extends RolesRoleWithPermissions {
  permissionValues: string;
}

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
    RouterLink
  ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  // Global
  loading = true;

  // Table
  roles: Role[] = []
  @ViewChild('dt') dt: Table | undefined;

  protected readonly tablePropertiesFilter = ['name', 'permissionValues'];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    protected formService: FormService,
    private rolesService: RolesService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.loadRoles()
  }

  // Load

  loadRoles() {
    this.loading = true;
    this.getRolesWithPermissions().pipe(finalize(() => {
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
    this.router.navigate(['/dashboard/admin/roles', role?.id, 'update']);
  }

  onRowDelete(event: Event, role: RolesRoleWithPermissions) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteRole(role))
  }

  // Roles

  getRolesWithPermissions(): Observable<Role[]> {
    return this.rolesService.getRoles().pipe(
      switchMap((roles: RolesRole[]) => {
        const rolesWithPermissions$ = roles.map(role =>
          this.rolesService.getRolePermissions(role.id!).pipe(
            map(permissions => ({
              ...role,
              permissions,
              permissionValues: permissions.map(p => p.value).join(', ')
            }))
          )
        );
        return forkJoin(rolesWithPermissions$);
      })
    );
  }

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
