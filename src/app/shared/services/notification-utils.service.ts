import {Injectable} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationUtilsService {
  constructor(private messageService: MessageService,
              private translateService: TranslateService,
              private confirmationService: ConfirmationService) {
  }

  showToastErrorWithTranslate(message: string, error?: any) {
    this.showToastError(this.translateService.instant(message), error);
  }

  showToastError(message: string, error?: any) {
    let detail = message;
    if (error?.error?.message) {
      detail += ` (${error.error.message})`;
    }

    this.messageService.add({
      key: 'main-toast',
      severity: 'error',
      detail,
      life: 4000
    });
  }

  showToastSuccessWithTranslate(message: string) {
    this.showToastSuccess(this.translateService.instant(message));
  }

  showToastSuccess(message: string) {
    this.messageService.add({
      key: 'main-toast',
      severity: 'success',
      detail: message,
      life: 4000
    });
  }

  showDeleteConfirmation(accept?: () => void, reject?: () => void, message?: string) {
    this.confirmationService.confirm({
      message: message ?? this.translateService.instant('modal.delete.message'),
      header: this.translateService.instant('modal.delete.title'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: this.translateService.instant('modal.delete.confirm'),
      rejectLabel: this.translateService.instant('modal.delete.cancel'),
      accept: accept,
      reject: reject
    });
  }


}
