import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {RolesRoleWithPermissions} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class RoleStore {

  private readonly _role = new BehaviorSubject<RolesRoleWithPermissions | null>(null);
  readonly role$ = this._role.asObservable();

  get role(): RolesRoleWithPermissions | undefined {
    return this._role.getValue() ?? undefined;
  }

  set role(val: RolesRoleWithPermissions | undefined) {
    this._role.next(val ?? null);
  }

  updateRole(update: RolesRoleWithPermissions) {
    if (this.role && this.role.id === update.id) {
      this.role = update;
    }
  }

  clearRole() {
    this.role = undefined;
  }
}
