import {Injectable} from "@angular/core";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {RolesRole, RolesRoleWithPermissions, RolesService} from "@core/api";

export interface Role extends RolesRoleWithPermissions {
  permissionValues: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private rolesService: RolesService
  ) {}

  getRoleWithPermissions(id: string): Observable<RolesRoleWithPermissions> {
    return this.rolesService.getRole(id).pipe(
      switchMap(role => {
        return this.rolesService.getRolePermissions(role.id!).pipe(
          map(permissions => ({
            ...role,
            permissions,
          }))
        )
      })
    )};

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
}
