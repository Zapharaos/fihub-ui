import {Injectable} from '@angular/core';
import {AuthJwtToken, UsersService, UsersUser, UsersUserWithPassword} from "@core/api";
import {firstValueFrom, from, Observable} from "rxjs";
import {AuthService as JwtAuthService} from "@core/api/api/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
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

      // TODO : set token in authService

      // Get current user
      // TODO : call service to get current self
      const user: UsersUser = {
        email: jwt.token,
      }

      return user;
    })());
  }
}
