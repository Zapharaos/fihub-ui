import {Injectable} from '@angular/core';
import {AuthJwtToken, UsersService, UsersUser, UsersUserWithPassword} from "@core/api";
import {firstValueFrom, from, Observable} from "rxjs";
import {AuthService as JwtAuthService} from "@core/api/api/auth.service";
import {AuthService} from "@core/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private JwtAuthService: JwtAuthService
  ) {
  }

  login(user: UsersUserWithPassword): Observable<UsersUser> {
    return from((async () => {
      const jwt = await firstValueFrom(this.JwtAuthService.getToken(user));
      return await firstValueFrom(this.setToken(jwt));
    })());
  }

  private setToken(jwt: AuthJwtToken): Observable<UsersUser> {
    return from((async () => {

      if (!jwt.token) {
        throw new Error('Token is missing');
      }

      // Set token
      this.authService.setToken(jwt.token);

      // Get current user
      const user = await firstValueFrom(this.usersService.getUserSelf());
      this.authService.setCurrentUser(user);
      this.authService.setLoaded(true);

      return user;
    })());
  }
}
