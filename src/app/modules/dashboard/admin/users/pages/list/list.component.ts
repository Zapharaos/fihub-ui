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
import {RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {RolesService, UserRolesService, UsersService, UsersUserWithRoles} from "@core/api";
import {finalize} from "rxjs";
import {handleErrors} from "@shared/utils/errors";
import {NotificationService} from "@shared/services/notification.service";
import {Tag} from "primeng/tag";

@Component({
  selector: 'app-list',
  imports: [
    Button,
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
  users: UsersUserWithRoles[] = []
  @ViewChild('dt') dt: Table | undefined;

  protected readonly tablePropertiesFilter = ['email', 'roleValues', 'created_at', 'updated_at'];

  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService
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
        console.log(users)
        this.users = users;
      },
      error: (error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  // Table

  onRowSelect(user: UsersUserWithRoles) {
    console.log(user)
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
