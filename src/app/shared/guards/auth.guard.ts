import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {finalize, forkJoin, Observable} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import {UsersService} from "@core/api";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

/*export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UsersService);
  const messageService = inject(MessageService);
  const translateService = inject(TranslateService);
  const router = inject(Router);

  console.log("no", authService.isLoaded(), authService.getToken(), authService.isAuthenticated())
  if (authService.getToken()) {
    return new Observable<boolean>(subscriber => {
      userService.getUserSelf().pipe(
        finalize(() => {
          authService.setLoaded(true);
        })
      ).subscribe({
        next: user => {
          authService.setCurrentUser(user);
          subscriber.next(false);
          subscriber.complete();
        },
        error: error => {
          if (error.status === 401) {
            authService.logout();
            forkJoin([
              translateService.get('messages.warning'),
              translateService.get('auth.messages.session-expired')]
            ).subscribe(([summary, detail]) => {
              router.navigate(['/auth']).then(() => {
                messageService.add({
                  severity: 'warning',
                  summary: summary,
                  detail: detail,
                  life: 5000
                });
              });
            });
          }
          subscriber.next(true);
          subscriber.complete();
        }
      });
    });
  }

  if (authService.isAuthenticated()) {
    return false;
  }
  return true;
}*/

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

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UsersService);
  const messageService = inject(MessageService);
  const translateService = inject(TranslateService);
  const router = inject(Router);

  if (!authService.isLoaded()) {
    const token = authService.getToken();
    if (!token) {
      return redirectToLogin(router, authService, messageService, translateService, state.url);
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
        error: error => {
          if (error.status === 401) {
            authService.logout();
            forkJoin([
              translateService.get('messages.warning'),
              translateService.get('auth.messages.session-expired')]
            ).subscribe(([summary, detail]) => {
              router.navigate(['/auth']).then(() => {
                messageService.add({
                  severity: 'warning',
                  summary: summary,
                  detail: detail,
                  life: 5000
                });
              });
            });
          }
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
  }

  if (!authService.isAuthenticated()) {
    return redirectToLogin(router, authService, messageService, translateService, state.url);
  }

  return true;
};

function redirectToLogin(router: Router, authService: AuthService, messageService: MessageService, translateService: TranslateService, url: string): boolean {
  // Set the redirect url so that the auth-guard can redirect after login
  authService.setRedirectUrl(url);
  // Redirect to the login page
  forkJoin([
    translateService.get('messages.error'),
    translateService.get('auth.messages.not-authenticated')
  ]).subscribe(([summary, detail]) => {
    router.navigate(['/auth']).then(() => {
      messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: summary,
        detail: detail,
        life: 4000
      });
    });
  });
  return false;
}
