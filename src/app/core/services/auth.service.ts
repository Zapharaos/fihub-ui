import {Injectable} from '@angular/core';
import {UsersUserWithRoles} from "@core/api";
import {hasPermissions} from "@shared/utils/permissions";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: UsersUserWithRoles | undefined;
  redirectUrl?: string;
  private loaded = false;
  private permissions = new Set<string>();

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
            if (permission.value && permission.value !== '*') {
              this.permissions.add(permission.value);
            }
          }
        }
      }
    }
    console.log(this.permissions);
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

}
