import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@shared/services/notification.service";

export const permissionGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);

  if (!route.data['permission']) {
    return true;
  }

  const permission = route.data['permission'] as string;
  if (authService.currentUserHasPermission(permission)) {
    return true;
  }

  const notificationService = inject(NotificationService);
  notificationService.showToastError('error.no-permission', undefined, 'http.401.summary')

  return false;
};
