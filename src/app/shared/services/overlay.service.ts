import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {


  constructor(
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }


  showDeleteConfirmation(event: Event, accept?: () => void, reject?: () => void) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('confirmation.delete.header'),
      message: this.translateService.instant('confirmation.delete.message'),
      rejectButtonProps: {
        label: this.translateService.instant('confirmation.cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translateService.instant('confirmation.delete.button'),
        severity: 'danger',
      },
      accept: accept,
      reject: reject
    });
  }
}
