import {Component, OnInit} from '@angular/core';
import {
    DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "@shared/services/notification.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {FormService} from "@shared/services/form.service";
import {RolesRoleWithPermissions, RolesService, UsersService, UsersUserWithRoles} from "@core/api";
import {notEmptyValidator} from "@shared/validators/array";
import {UserStore} from "@modules/dashboard/admin/users/stores/user.service";
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
    roles: RolesRoleWithPermissions[] = [];
    user: UsersUserWithRoles = {};
    showSelectedRolesOnly = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private fb: FormBuilder,
        protected formService: FormService,
        private userStore: UserStore,
        private userService: UsersService,
        private rolesService: RolesService,
        private authService: AuthService
    ) {
       // Init form
        this.formService.init(this.fb.group({
            roles: [this.user.roles, notEmptyValidator()]
        }));

        this.loadUser();
    }

    ngOnInit(): void {
        this.loadRoles();
    }

    loadUser() {
        // Retrieve user data
        const user = this.userStore.user;

        // If the user is already loaded
        if (user) {
            this.user = user;
            this.patchForm();
            return;
        }

        // If the user is not loaded, then retrieve it from the API
        const userID = this.route.snapshot.paramMap.get('id');
        this.userService.getUser(userID!).subscribe({
            next: (user: UsersUserWithRoles) => {
                this.userStore.user = user;
                this.user = user;
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
        this.rolesService.getRoles().pipe(finalize(() => {
            this.loading = false;
        })).subscribe({
            next: (roles: RolesRoleWithPermissions[]) => {
                this.roles = roles;
            },
            error: (error: Error) => {
                handleErrors(error, this.notificationService);
            }
        })
    }

    // User

    setRoles(user: UsersUserWithRoles) {
        this.loading = true;
        this.userService.setUser(user.id!, user).pipe(finalize(() => {
            this.loading = false;
        })).subscribe({
            next: () => {
                // Success : navigate back to the users page
                firstValueFrom(this.userService.getUserSelf()).then((user) => {
                  this.authService.setCurrentUser(user);
                  this.authService.setLoaded(true);
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

        const user: UsersUserWithRoles = {
            id: this.user.id,
            roles: this.formService.getFormValue().roles,
        }

        // Call API
        this.setRoles(user)
    }

    patchForm() {
        this.formService.patchValue({
            roles: this.user.roles
        });
    }

    // Table

    onRowSelect(event: TableRowSelectEvent) {
        if (!this.user.roles?.some(p => p.id === event.data.id)) {
            this.user.roles?.push(event.data);
        }
        this.formService.setControlValue('roles', this.user.roles, true);
    }

    onRowUnselect(event: TableRowSelectEvent) {
        this.user.roles = this.user.roles?.filter(p => p.id !== event.data.id);
        this.formService.setControlValue('roles', this.user.roles, true);
    }

    onHeaderCheckboxToggle(event: { checked: boolean }) {
        if (event.checked) {
            this.user.roles = this.roles;
        } else {
            this.user.roles = [];
        }
        this.formService.setControlValue('roles', this.user.roles);
    }

    toggleSelectedRolesOnly() {
        this.showSelectedRolesOnly = !this.showSelectedRolesOnly;
    }

    protected readonly applyFilterGlobal = applyFilterGlobal;
}
