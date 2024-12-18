import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  form: FormGroup | undefined;

  init(form: FormGroup) {
    this.form = form;
  }

  isInvalid() {
    return this.form?.invalid;
  }

  isSubmitDisabled() {
    return this.form?.invalid || !this.form?.dirty;
  }

  isFieldValuable(fieldName: string) {
    return this.form?.get(fieldName)?.value;
  }

  isFieldValueEqual(fieldName: string, valueToCompare: any) {
    return this.form?.get(fieldName)?.value === valueToCompare;
  }

  hasErrorTouched(fieldName: string): boolean {
    const ctrl = this.form?.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.touched;
    }
    return false;
  }

  hasSpecifiedError(fieldName: string, specifiedError: string): boolean {
    const ctrl = this.form?.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.errors?.[specifiedError];
    }
    return false;
  }

  hasSpecifiedErrorTouched(fieldName: string, specifiedError: string): boolean {
    const ctrl = this.form?.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.touched && ctrl.errors?.[specifiedError];
    }
    return false;
  }
}
