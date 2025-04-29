import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ModelsUser, ModelsRoleWithPermissions} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private readonly _user = new BehaviorSubject<ModelsUser | null>(null);
  readonly user$ = this._user.asObservable();
  private readonly _roles = new BehaviorSubject<ModelsRoleWithPermissions[] | null>(null);
  readonly roles$ = this._roles.asObservable();

  get user(): ModelsUser | undefined {
    return this._user.getValue() ?? undefined;
  }

  set user(val: ModelsUser | undefined) {
    this._user.next(val ?? null);
  }

  get roles(): ModelsRoleWithPermissions[] | undefined {
    return this._roles.getValue() ?? undefined;
  }

  set roles(val: ModelsRoleWithPermissions[] | undefined) {
    this._roles.next(val ?? null);
  }

  updateUser(update: ModelsUser) {
    if (this.user && this.user.ID === update.ID) {
      this.user = update;
    }
  }

  clearUser() {
    this.user = undefined;
  }
}
