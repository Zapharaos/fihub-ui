import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/api";
import {FormGroup} from "@angular/forms";

export enum DialogMode {
  HIDDEN = 'hidden',
  CREATE = 'create',
  UPDATE = 'update',
  IMAGE = 'image'
}

export interface DialogProps {
  dialogMode: DialogMode,
  dialogVisible: boolean,
  open?: () => void,
  close?: () => void,
  create?: () => void,
  update?: () => void,
}

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

  isDialogModeHidden(dialogProps: DialogProps): boolean {
    return dialogProps.dialogMode === DialogMode.HIDDEN;
  }

  isDialogModeCreate(dialogProps: DialogProps): boolean {
    return dialogProps.dialogMode === DialogMode.CREATE;
  }

  isDialogModeUpdate(dialogProps: DialogProps): boolean {
    return dialogProps.dialogMode === DialogMode.UPDATE;
  }

  isDialogModeImage(dialogProps: DialogProps): boolean {
    return dialogProps.dialogMode === DialogMode.IMAGE;
  }

  getDialogLabelClose(dialogProps: DialogProps): string {
    switch (dialogProps.dialogMode) {
      case DialogMode.CREATE:
        return 'actions.cancel';
      case DialogMode.UPDATE:
        return 'actions.cancel';
      case DialogMode.IMAGE:
        return 'actions.close';
      default:
        return '';
    }
  }

  getDialogLabelSubmit(dialogProps: DialogProps): string {
    switch (dialogProps.dialogMode) {
      case DialogMode.CREATE:
        return 'actions.create';
      case DialogMode.UPDATE:
        return 'actions.update';
      default:
        return '';
    }
  }

  openDialog(dialogProps: DialogProps, dialogMode: DialogMode) {
    dialogProps.dialogVisible = true;
    dialogProps.dialogMode = dialogMode;
    dialogProps.open?.();
  }

  closeDialog(dialogProps: DialogProps) {
    dialogProps.dialogMode = DialogMode.HIDDEN;
    dialogProps.dialogVisible = false;
    dialogProps.close?.();
  }

  submitDialog(dialogProps: DialogProps) {
    switch (dialogProps.dialogMode) {
      case DialogMode.CREATE:
        dialogProps.create?.();
        break;
      case DialogMode.UPDATE:
        dialogProps.update?.();
        break;
    }
  }
}
