import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import { Location } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const location = inject(Location);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Set the redirect url so that the auth-guard can redirect after login
        authService.setRedirectUrl(location.path());

        // Redirect to the login page
        router.navigate(['/auth']);
      }
      // Re-throw the error so that other error handlers can catch it
      return throwError(() => error);
    })
  );
};
