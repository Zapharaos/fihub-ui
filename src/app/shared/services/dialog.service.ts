import {EventEmitter, Injectable, Output} from '@angular/core';

export enum DialogMode {
  HIDDEN = 'hidden',
  CREATE = 'create',
  UPDATE = 'update',
  IMAGE = 'image'
}

export interface DialogProps {
  mode: DialogMode,
  visible: boolean,
  create?: () => void,
  update?: () => void,
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogProps: DialogProps = {
    mode: DialogMode.HIDDEN,
    visible: false
  };

  @Output() dialogVisibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  init(): void {
    this.dialogProps = {
      mode: DialogMode.HIDDEN,
      visible: false
    };
    this.dialogVisibilityChange.emit(false);
  }

  setDialogPropsCreate(create: () => void) {
    this.dialogProps.create = create;
  }

  setDialogPropsUpdate(update: () => void) {
    this.dialogProps.update = update;
  }

  isDialogModeCreate(): boolean {
    return this.dialogProps.mode === DialogMode.CREATE;
  }

  isDialogModeUpdate(): boolean {
    return this.dialogProps.mode === DialogMode.UPDATE;
  }

  isDialogModeImage(): boolean {
    return this.dialogProps.mode === DialogMode.IMAGE;
  }

  getDialogLabelClose(): string {
    switch (this.dialogProps.mode) {
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

  getDialogLabelSubmit(): string {
    switch (this.dialogProps.mode) {
      case DialogMode.CREATE:
        return 'actions.create';
      case DialogMode.UPDATE:
        return 'actions.update';
      default:
        return '';
    }
  }

  openDialog(dialogMode: DialogMode) {
    this.setVisibility(true, dialogMode);
  }

  closeDialog() {
    this.setVisibility(false, DialogMode.HIDDEN);
  }

  submitDialog() {
    switch (this.dialogProps.mode) {
      case DialogMode.CREATE:
        this.dialogProps.create?.();
        break;
      case DialogMode.UPDATE:
        this.dialogProps.update?.();
        break;
    }
  }

  private setVisibility(visibility: boolean, dialogMode?: DialogMode) {
    this.dialogProps.visible = visibility;
    this.dialogVisibilityChange.emit(visibility);
    this.dialogProps.mode = dialogMode ?? DialogMode.HIDDEN;
  }
}
