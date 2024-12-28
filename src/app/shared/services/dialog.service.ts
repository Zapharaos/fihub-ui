import {EventEmitter, Injectable, Output} from '@angular/core';

export enum DialogMode {
  HIDDEN = 'hidden',
  CREATE = 'create',
  UPDATE = 'update',
  IMAGE = 'image',
  PASSWORD = 'password',
}

export interface DialogItem {
  status: DialogMode,
  action?: () => void,
  titleLabel: string,
  closeLabel?: string,
  submitLabel?: string,
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogs: DialogItem[] = [];
  private visible: boolean = false;
  private active: DialogMode = DialogMode.HIDDEN;

  @Output() dialogVisibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  init(dialogs: DialogItem[]): void {
    this.dialogs = dialogs;
    this.setVisibility(false);
  }

  reset(): void {
    this.dialogs = [];
    this.setVisibility(false);
  }

  open(dialogMode: DialogMode) {
    this.setVisibility(true, dialogMode);
  }

  close() {
    this.setVisibility(false, DialogMode.HIDDEN);
  }

  submit() {
    const dialog = this.getActive();
    if (dialog && dialog.action) {
      dialog.action();
    }
  }

  isActive(dialogMode: DialogMode): boolean {
    return this.active === dialogMode;
  }

  getLabelTitle(): string {
    return this.getActive()?.titleLabel ?? '';
  }

  getLabelClose(): string {
    return this.getActive()?.closeLabel ?? 'actions.cancel';
  }

  getLabelSubmit(): string {
    return this.getActive()?.submitLabel ?? 'actions.submit';
  }

  private getActive(): DialogItem | undefined {
    return this.dialogs.find(dialog => dialog.status === this.active);
  }

  private setVisibility(visibility: boolean, dialogMode?: DialogMode) {
    // Verify if the dialogMode corresponds to a dialog that is in the list of dialogs
    if (dialogMode && dialogMode !== DialogMode.HIDDEN &&
      !this.dialogs.find(dialog => dialog.status === dialogMode)) {
      console.error('Dialog mode not found in the list of dialogs');
      return;
    }
    this.active = dialogMode ?? DialogMode.HIDDEN;
    this.visible = visibility;
    this.dialogVisibilityChange.emit(visibility);
  }
}
