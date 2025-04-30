import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {Router} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {UserService, ModelsUser, SecurityService, ModelsUserWithRoles} from "@core/api";
import {finalize} from "rxjs";
import {handleErrors} from "@shared/utils/errors";
import {NotificationService} from "@shared/services/notification.service";
import {Tag} from "primeng/tag";
import {DialogMode} from "@shared/services/dialog.service";
import {PermissionDirective} from "@shared/directives/permission.directive";

@Component({
  selector: 'app-list',
  imports: [
    DashboardContentLayoutComponent,
    IconField,
    InputIcon,
    InputText,
    TranslatePipe,
    NgForOf,
    PrimeTemplate,
    Skeleton,
    TableModule,
    NgIf,
    Tag,
    PermissionDirective,
    NgTemplateOutlet
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  // Global
  loading = true;

  // Table
  user!: ModelsUser;
  users: ModelsUser[] = []
  @ViewChild('dt') dt: Table | undefined;

  protected readonly tablePropertiesFilter = ['email', 'roleValues', 'created_at', 'updated_at'];

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  // Load

  loadUsers() {
    this.loading = true;
    this.securityService.listUsersWithRoles().pipe(finalize(() => {
      this.loading = false
    })).subscribe({
      next: (users: ModelsUserWithRoles[]) => {
        this.users = users;
      },
      error: (error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  // Table

  onRowSelect() {
    this.router.navigate([`/dashboard/admin/users/${this.user.ID}/update`]);
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
  protected readonly DialogMode = DialogMode;
}
