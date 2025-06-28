import {Injectable} from '@angular/core';
import {ModelsUser, ModelsRoleWithPermissions} from "@core/api";
import {hasPermissions} from "@shared/utils/permissions";
import {BehaviorSubject} from "rxjs";
import {LocalStorageKeys} from "@shared/models/local-storage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: ModelsUser | undefined;
  currentUserRoles: ModelsRoleWithPermissions[] = [];
  redirectUrl?: string;
  private loaded = false;
  private _permissions = new BehaviorSubject<Set<string>>(new Set<string>());
  permissions$ = this._permissions.asObservable();
  private readonly localStorageKey = LocalStorageKeys.AuthToken;

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
    return localStorage.getItem(this.localStorageKey) || undefined;
  }

  setToken(token: string): void {
    localStorage.setItem(this.localStorageKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  setCurrentUser(user?: ModelsUser, roles?: ModelsRoleWithPermissions[]): void {
    this.currentUser = user;
    this.setCurrentUserRoles(roles ?? []);
  }

  setCurrentUserRoles(roles: ModelsRoleWithPermissions[]): void {
    this.currentUserRoles = roles;
    // Load permissions from the user roles
    this.permissions.clear();
    if (roles) {
      for (const role of roles) {
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
    localStorage.removeItem(this.localStorageKey);
  }

  setRedirectUrl(url?: string) {
    this.redirectUrl = url;
  }

  currentUserHasRole(role: string): boolean {
    if (!this.currentUser || !this.currentUserRoles) {
      return false;
    }

    for (const roleKey in this.currentUserRoles) {
      if (this.currentUserRoles[roleKey].name === role) {
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
