import {AbstractControl, ValidatorFn} from "@angular/forms";

export function minArrayLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!Array.isArray(control.value) || control.value.length < minLength) {
      return {minLength: 'Array length must be at least ' + minLength};
    }
    return null;
  };
}

export function notEmptyValidator(): ValidatorFn {
  return minArrayLengthValidator(1);
}
