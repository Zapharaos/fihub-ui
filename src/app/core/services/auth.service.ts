import {Injectable} from '@angular/core';
import {UsersUser} from "@core/api";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: UsersUser | undefined;
  private loaded = false;
  redirectUrl?: string;

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

  setCurrentUser(user?: UsersUser) {
    this.currentUser = user;
  }

  logout() {
    this.setCurrentUser(undefined);
    localStorage.removeItem('token');
  }

  setRedirectUrl(url?: string) {
    this.redirectUrl = url;
  }

}
