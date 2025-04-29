import {Injectable} from '@angular/core';
import {AuthJwtToken, UserService, ModelsUser, ModelsUserWithPassword, ModelsRoleWithPermissions} from "@core/api";
import {firstValueFrom, from, Observable} from "rxjs";
import {AuthService as JwtAuthService} from "@core/api/api/auth.service";
import {AuthService} from "@core/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private JwtAuthService: JwtAuthService
  ) {
  }

  login(user: ModelsUserWithPassword): Observable<ModelsUser> {
    return from((async () => {
      const jwt = await firstValueFrom(this.JwtAuthService.getToken(user));
      return await firstValueFrom(this.setToken(jwt));
    })());
  }

  private setToken(jwt: AuthJwtToken): Observable<ModelsUser> {
    return from((async () => {

      if (!jwt.token) {
        throw new Error('Token is missing');
      }

      // Set token
      this.authService.setToken(jwt.token);

      // Get current user and his roles
      const user = await firstValueFrom(this.userService.getUserSelf());
      const userRoles = await firstValueFrom(this.userService.listRolesWithPermissionsForUser(user.ID!))
      this.authService.setCurrentUser(user, userRoles);
      this.authService.setLoaded(true);

      return user;
    })());
  }
}
