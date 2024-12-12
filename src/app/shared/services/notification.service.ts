import {Injectable} from '@angular/core';
import {InterpolationParameters, TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";

export type TranslationKey = string | string[]
export type TranslationParams = InterpolationParameters | undefined

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly toastKey = 'main-toast';
  private readonly tostLife = 5000;

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) { }

  showToastSuccess(translateKey: TranslationKey, translateParams?:  TranslationParams, summary?: string) {
    this.translateAndShowToast('success', translateKey, translateParams, summary ?? 'messages.success');
  }

  showToastWarn(translateKey: TranslationKey, translateParams?:  TranslationParams, summary?: string) {
    this.translateAndShowToast('warn', translateKey, translateParams, summary ?? 'messages.warn');
  }

  showToastError(translateKey: TranslationKey, translateParams?:  TranslationParams, summary?: string) {
    this.translateAndShowToast('error', translateKey, translateParams, summary ?? 'messages.error');
  }

  private translateAndShowToast(severity: string, translateKey: TranslationKey, translateParams?:  TranslationParams, summary?: string): void {
    if (summary) {
      this.showToast(severity, this.translateService.instant(translateKey, translateParams), this.translateService.instant(summary));
      return;
    }
    this.showToast(severity, this.translateService.instant(translateKey, translateParams));
  }

  private showToast(severity: string, message: string, summary?: string): void {
    this.messageService.add({
      key: this.toastKey,
      life: this.tostLife,
      severity: severity,
      detail: message,
      summary: summary
    });
  }


}
