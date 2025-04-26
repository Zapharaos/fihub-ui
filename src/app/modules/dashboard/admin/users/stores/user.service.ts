import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ModelsUserWithRoles} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private readonly _user = new BehaviorSubject<ModelsUserWithRoles | null>(null);
  readonly user$ = this._user.asObservable();

  get user(): ModelsUserWithRoles | undefined {
    return this._user.getValue() ?? undefined;
  }

  set user(val: ModelsUserWithRoles | undefined) {
    this._user.next(val ?? null);
  }

  updateUser(update: ModelsUserWithRoles) {
    if (this.user && this.user.ID === update.ID) {
      this.user = update;
    }
  }

  clearUser() {
    this.user = undefined;
  }
}
