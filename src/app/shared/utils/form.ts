import {FormGroup} from "@angular/forms";

export function isFormInvalid(form: FormGroup) {
  return form.invalid;
}

export function isSubmitDisabled(form: FormGroup) {
  return form.invalid || !form.dirty;
}

export function isFieldValuable(form: FormGroup, fieldName: string) {
  return form.get(fieldName)?.value;
}

export function isFieldValueEqual(form: FormGroup, fieldName: string, valueToCompare: any) {
  return form.get(fieldName)?.value === valueToCompare;
}

export function ctrlHasErrorTouched(form: FormGroup, fieldName: string): boolean {
  const ctrl = form.get(fieldName);
  if (ctrl) {
    return ctrl.invalid && ctrl.touched;
  }
  return false;
}

export function ctrlHasSpecifiedError(form: FormGroup, fieldName: string, specifiedError: string): boolean {
  const ctrl = form.get(fieldName);
  if (ctrl) {
    return ctrl.invalid && ctrl.errors?.[specifiedError];
  }
  return false;
}

export function ctrlHasErrorTouchedExceptSpecified(form: FormGroup, fieldName: string, specifiedError: string): boolean {
  const ctrl = form.get(fieldName);
  if (ctrl) {
    return ctrl.invalid && ctrl.touched && !ctrl.errors?.[specifiedError];
  }
  return false;
}
