import {Component, OnInit} from '@angular/core';
import {
    DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "@shared/services/notification.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {FormService} from "@shared/services/form.service";
import {ModelsRoleWithPermissions, SecurityService, UserService} from "@core/api";
import {notEmptyValidator} from "@shared/validators/array";
import {handleErrors} from "@shared/utils/errors";
import {finalize, firstValueFrom} from "rxjs";
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {Button} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {TranslatePipe} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Skeleton} from "primeng/skeleton";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-update',
    imports: [
        DashboardContentLayoutComponent,
        ReactiveFormsModule,
        Button,
        Ripple,
        TranslatePipe,
        IconField,
        InputIcon,
        InputText,
        NgForOf,
        PrimeTemplate,
        Skeleton,
        TableModule,
        NgIf
    ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit {

    protected readonly tablePropertiesFilter = ['name', 'permissions'];

    loading = true;
    roles: ModelsRoleWithPermissions[] = [];
    userID: string | null = null;
    userRoles: ModelsRoleWithPermissions[] = [];
    showSelectedRolesOnly = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private fb: FormBuilder,
        protected formService: FormService,
        private securityService: SecurityService,
        private userService: UserService,
        private authService: AuthService
    ) {
       // Init form
        this.formService.init(this.fb.group({
            roles: [this.userRoles, notEmptyValidator()]
        }));

        this.loadUser();
    }

    ngOnInit(): void {
        this.loadRoles();
    }

    loadUser() {

       this.userID = this.route.snapshot.paramMap.get('id');

        // If requested user is the current user, then we do not need to load it
        if (this.userID === this.authService.currentUser?.ID) {
          // Retrieve user data
          this.userRoles = this.authService.currentUserRoles;
          this.patchForm();
          return;
        }

        // If the user is not loaded, then retrieve it from the API
        this.securityService.listRolesWithPermissionsForUser(this.userID!).subscribe({
            next: (roles: ModelsRoleWithPermissions[]) => {
                this.userRoles = roles;
                this.patchForm();
            },
            error: (error: Error) => {
                handleErrors(error, this.notificationService);
                // Could not retrieve the user : nothing to do on this page
                this.router.navigate(['/dashboard/admin/users']);
            }
        })
    }

    loadRoles() {
        this.loading = true;
        this.securityService.listRoles().pipe(finalize(() => {
            this.loading = false;
        })).subscribe({
            next: (roles: ModelsRoleWithPermissions[]) => {
                this.roles = roles;
            },
            error: (error: Error) => {
                handleErrors(error, this.notificationService);
            }
        })
    }

    // User

    setRoles(userID: string, roleIDs: string[]) {
        this.loading = true;
        this.securityService.setRolesForUser(userID, roleIDs).pipe(finalize(() => {
            this.loading = false;
        })).subscribe({
            next: () => {
                // Success : navigate back to the users page
                firstValueFrom(this.userService.listRolesWithPermissionsForUser(userID)).then((roles) => {
                  if (this.userID === this.authService.currentUser?.ID) {
                    this.authService.setCurrentUserRoles(roles);
                  }
                  this.router.navigate(['/dashboard/admin/users']).then(() => {
                    this.notificationService.showToastSuccess('admin.users.messages.update-success')
                  })
                });
            },
            error: (error: Error) => {
                handleErrors(error, this.notificationService);
            }
        })
    }

    // Form

    submit() {
        // Skip if form invalid
        if (this.formService.isInvalid()) {
            return;
        }

        const roleIDs = this.formService.getFormValue().roles.map((role: ModelsRoleWithPermissions) => role.id);

        // Call API
        this.setRoles(this.userID!, roleIDs)
    }

    patchForm() {
        this.formService.patchValue({
            roles: this.userRoles
        });
    }

    // Table

    onRowSelect(event: TableRowSelectEvent) {
        if (!this.userRoles?.some(p => p.id === event.data.id)) {
            this.userRoles?.push(event.data);
        }
        this.formService.setControlValue('roles', this.userRoles, true);
    }

    onRowUnselect(event: TableRowSelectEvent) {
        this.userRoles = this.userRoles?.filter(p => p.id !== event.data.id);
        this.formService.setControlValue('roles', this.userRoles, true);
    }

    onHeaderCheckboxToggle(event: { checked: boolean }) {
        if (event.checked) {
            this.userRoles = this.roles;
        } else {
            this.userRoles = [];
        }
        this.formService.setControlValue('roles', this.userRoles);
    }

    toggleSelectedRolesOnly() {
        this.showSelectedRolesOnly = !this.showSelectedRolesOnly;
    }

    protected readonly applyFilterGlobal = applyFilterGlobal;
}
