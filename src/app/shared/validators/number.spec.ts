import { AbstractControl } from '@angular/forms';
import { numberPositiveValidator } from './number';

describe('NumberValidator', () => {

  const validator = numberPositiveValidator();

  it('should return null if the value is a positive number', () => {
    const control = { value: 123 } as AbstractControl;
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error object if the value is not a number or is less than or equal to 0', () => {
    const control = { value: 'abc' } as AbstractControl;
    const result = validator(control);
    expect(result).toEqual({ invalid: 'Number should be superior to 0' });
  });

  it('should return an error object if the value is less than or equal to 0', () => {
    const control = { value: 0 } as AbstractControl;
    const result = validator(control);
    expect(result).toEqual({ invalid: 'Number should be superior to 0' });
  });
});
