import {Injectable} from '@angular/core';
import {UsersUserWithRoles} from "@core/api";
import {hasPermissions} from "@shared/utils/permissions";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: UsersUserWithRoles | undefined;
  redirectUrl?: string;
  private loaded = false;
  private _permissions = new BehaviorSubject<Set<string>>(new Set<string>());
  permissions$ = this._permissions.asObservable();

  /**
   * Returns whether the authentication service has been loaded
   * (i.e. the current user has been fetched from the API)
   */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Set the loaded status of the authentication service
   * @param loaded
   */
  setLoaded(loaded: boolean): void {
    this.loaded = loaded;
  }

  getToken(): string | undefined {
    return localStorage.getItem('token') || undefined;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  setCurrentUser(user?: UsersUserWithRoles) {
    this.currentUser = user;

    // Load permissions from the user roles
    this.permissions.clear();
    if (user && user.roles) {
      for (const role of user.roles) {
        if (role.permissions) {
          for (const permission of role.permissions) {
            if (permission.value) {
              this.permissions.add(permission.value);
            }
          }
        }
      }
    }
    this.notifyPermissionsChanged();
  }

  logout() {
    this.setCurrentUser(undefined);
    localStorage.removeItem('token');
  }

  setRedirectUrl(url?: string) {
    this.redirectUrl = url;
  }

  currentUserHasRole(role: string): boolean {
    if (!this.currentUser || !this.currentUser.roles) {
      return false;
    }

    for (const roleKey in this.currentUser.roles) {
      if (this.currentUser.roles[roleKey].name === role) {
        return true;
      }
    }

    return false;
  }

  currentUserHasPermission(permission: string | string[]): boolean {
    return !this.currentUser ? false : hasPermissions(permission, this.permissions);
  }

  private get permissions(): Set<string> {
    return this._permissions.getValue();
  }

  private set permissions(val: Set<string>) {
    this._permissions.next(val);
  }

  private notifyPermissionsChanged() {
    this._permissions.next(new Set(this.permissions));
  }

}
