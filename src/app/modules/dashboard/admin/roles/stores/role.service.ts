import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ModelsRoleWithPermissions} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class RoleStore {

  private readonly _role = new BehaviorSubject<ModelsRoleWithPermissions | null>(null);
  readonly role$ = this._role.asObservable();

  get role(): ModelsRoleWithPermissions | undefined {
    return this._role.getValue() ?? undefined;
  }

  set role(val: ModelsRoleWithPermissions | undefined) {
    this._role.next(val ?? null);
  }

  updateRole(update: ModelsRoleWithPermissions) {
    if (this.role && this.role.id === update.id) {
      this.role = update;
    }
  }

  clearRole() {
    this.role = undefined;
  }
}
