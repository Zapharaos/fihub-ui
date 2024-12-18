import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  form: FormGroup = this.fb.group({});
  copy: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
  ) {  }

  init(form: FormGroup) {
    this.form = form;
    this.copy = form;
  }

  clear() {
    this.form = this.copy!;
  }

  reset() {
    this.form.reset();
  }

  getForm() {
    return this.form;
  }


  getFormValue() {
    return this.form.value;
  }

  isInvalid() {
    return this.form.invalid;
  }

  isSubmitDisabled() {
    return this.form.invalid || !this.form.dirty;
  }

  isFieldValuable(fieldName: string) {
    return this.form.get(fieldName)?.value;
  }

  isFieldValueEqual(fieldName: string, valueToCompare: any) {
    return this.form.get(fieldName)?.value === valueToCompare;
  }

  hasErrorTouched(fieldName: string): boolean {
    const ctrl = this.form.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.touched;
    }
    return false;
  }

  hasSpecifiedError(fieldName: string, specifiedError: string): boolean {
    const ctrl = this.form.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.errors?.[specifiedError];
    }
    return false;
  }

  hasSpecifiedErrorTouched(fieldName: string, specifiedError: string): boolean {
    const ctrl = this.form.get(fieldName);
    if (ctrl) {
      return ctrl.invalid && ctrl.touched && ctrl.errors?.[specifiedError];
    }
    return false;
  }

  hasSpecifiedErrors(fieldName: string, touchedErrors: string[], errors: string[]): boolean {
    const ctrl = this.form.get(fieldName);
    if (!ctrl || !ctrl.invalid) {
      return false;
    }

    for (const touchedError of touchedErrors) {
      if (ctrl.touched && ctrl.errors?.[touchedError]) {
        return true;
      }
    }

    for (const error of errors) {
      if (ctrl.errors?.[error]) {
        return true;
      }
    }

    return false;
  }

  addControl(fieldName: string, object: any, validators?: ValidatorFn | ValidatorFn[]) {
    this.form.addControl(fieldName, new FormControl(object, validators));
  }

  addControlRequired(fieldName: string, object: any) {
    this.form.addControl(fieldName, new FormControl(object, [Validators.required]));
  }

  addControlPostEmail(fieldName: string, object: any) {
    this.form.addControl(fieldName, new FormControl(object, [Validators.email, Validators.required]));
  }

  addControlPostPassword(fieldName: string, object: any) {
    this.form.addControl(fieldName, new FormControl(object, [
      Validators.minLength(8), Validators.maxLength(64), Validators.required]
    ));
  }

  addControlCheckbox(fieldName: string, object: any) {
    this.form.addControl(fieldName, new FormControl(object, [Validators.requiredTrue]));
  }

  addFieldValidators(fieldName: string, validators: ValidatorFn | ValidatorFn[]) {
    this.form.get(fieldName)?.addValidators(validators);
  }

  addFormValidators(validators: ValidatorFn | ValidatorFn[]) {
    this.form.addValidators(validators);
  }

  setFieldErrors(fieldName: string, errors: string[], opts?: {emitEvent?: boolean}) {
    let validationErrors: ValidationErrors | null = {};
    errors.forEach(error => {
      validationErrors = {
        ...validationErrors,
        [error]: true
      }
    })
    console.log(validationErrors);
    this.form.get(fieldName)?.setErrors(validationErrors, opts);
  }
}
