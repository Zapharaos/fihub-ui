import {AbstractControl, ValidatorFn} from "@angular/forms";

export function numberPositiveValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    if (control.value <= 0 || isNaN(control.value)) {
      return {invalid: 'Number should be superior to 0'};
    }
    return null;
  }
}
