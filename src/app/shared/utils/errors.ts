import {NotificationService} from "@shared/services/notification.service";

export interface ResponseError extends Error {
  status?: number;
  error?: {
    message?: string;
    title?: string;
  };
}

export function handleErrors(error: ResponseError, notificationService: NotificationService, handler400?: (error: ResponseError) => void) {
  switch (error.status) {
    case 400:
      if (handler400) {
        handler400(error);
        break;
      }
      notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
      break;
    case 401:
      notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
      break;
    case 404:
      notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
      break;
    case 429:
      notificationService.showToastError('http.429.detail', undefined, 'http.429.summary')
      break;
    default:
      notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      break;
  }
}
