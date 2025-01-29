import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {finalize, Observable} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import {UsersService} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {ResponseError} from "@shared/utils/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If there is a user or token, then redirect to the overview's guard
  // If not, then there is no way to retrieve any user's data so pass
  if (authService.isAuthenticated() || authService.getToken()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
}

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UsersService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  if (!authService.isLoaded()) {
    const token = authService.getToken();
    if (!token) {
      return redirectToLogin(router, authService, notificationService, state.url);
    }

    return new Observable<boolean>(subscriber => {
      userService.getUserSelf().pipe(
        finalize(() => {
          authService.setLoaded(true);
        })
      ).subscribe({
        next: user => {
          authService.setCurrentUser(user);
          subscriber.next(true);
          subscriber.complete();
        },
        error: (error: ResponseError) => {
          if (error.status === 401) {
            authService.logout();
            router.navigate(['/auth']).then(() => {
              notificationService.showToastWarn('auth.messages.session-expired');
            })
          }
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
  }

  if (!authService.isAuthenticated()) {
    return redirectToLogin(router, authService, notificationService, state.url);
  }

  return true;
};

function redirectToLogin(router: Router, authService: AuthService, notificationService: NotificationService, url: string): boolean {
  // Set the redirect url so that the auth-guard can redirect after login
  authService.setRedirectUrl(url);
  // Redirect to the login page
  router.navigate(['/auth']).then(() => {
    notificationService.showToastError('auth.messages.not-authenticated');
  });
  return false;
}
