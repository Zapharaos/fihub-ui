import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UsersUserWithRoles} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private readonly _user = new BehaviorSubject<UsersUserWithRoles | null>(null);
  readonly user$ = this._user.asObservable();

  get user(): UsersUserWithRoles | undefined {
    return this._user.getValue() ?? undefined;
  }

  set user(val: UsersUserWithRoles | undefined) {
    this._user.next(val ?? null);
  }

  updateUser(update: UsersUserWithRoles) {
    if (this.user && this.user.id === update.id) {
      this.user = update;
    }
  }

  clearUser() {
    this.user = undefined;
  }
}
