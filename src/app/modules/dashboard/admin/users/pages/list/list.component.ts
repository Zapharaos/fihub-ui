import {Component, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {Router, RouterLink} from "@angular/router";
import {Table, TableModule, TableRowSelectEvent} from "primeng/table";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {RolesService, UserRolesService, UsersService, UsersUserWithRoles} from "@core/api";
import {finalize} from "rxjs";
import {handleErrors} from "@shared/utils/errors";
import {NotificationService} from "@shared/services/notification.service";
import {Tag} from "primeng/tag";
import {UserStore} from "@modules/dashboard/admin/users/stores/user.service";

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
    Tag
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  // Global
  loading = true;

  // Table
  user!: UsersUserWithRoles;
  users: UsersUserWithRoles[] = []
  @ViewChild('dt') dt: Table | undefined;

  protected readonly tablePropertiesFilter = ['email', 'roleValues', 'created_at', 'updated_at'];

  constructor(
    private router: Router,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private usersStore: UserStore
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  // Load

  loadUsers() {
    this.loading = true;
    this.usersService.getAllUsersWithRoles().pipe(finalize(() => {
      this.loading = false
    })).subscribe({
      next: (users: UsersUserWithRoles[]) => {
        this.users = users;
      },
      error: (error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  // Table

  onRowSelect() {
    this.usersStore.user = this.user;
    this.router.navigate([`/dashboard/admin/users/${this.user.id}/update`]);
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
