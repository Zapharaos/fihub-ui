import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/api";

export interface DeleteConfirmationProps {
  event: Event;
  message?: string;
  accept?: () => void;
  reject?: () => void;
};

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  showDeleteConfirmation(props: DeleteConfirmationProps) {
    const message = props.message ? props.message : 'confirmation.delete.message';
    this.confirmationService.confirm({
      target: props.event.target as EventTarget,
      header: this.translateService.instant('confirmation.delete.header'),
      message: this.translateService.instant(message),
      rejectButtonProps: {
        label: this.translateService.instant('confirmation.cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translateService.instant('confirmation.delete.button'),
        severity: 'danger',
      },
      accept: props.accept,
      reject: props.reject
    });
  }
}
