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
import {NgForOf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {UsersUserWithRoles} from "@core/api";

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
    TableModule
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

  ) { }

  ngOnInit() {

  }

  // Load

  // Table

  onRowSelect(user: UsersUserWithRoles) {
    console.log(user)
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
}
