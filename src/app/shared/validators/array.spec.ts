import { minArrayLengthValidator, notEmptyValidator } from './array';
import { FormControl } from '@angular/forms';

describe('Array Validators', () => {
  describe('minArrayLengthValidator', () => {
    it('should return null if array length is greater than or equal to min length', () => {
      const validator = minArrayLengthValidator(2);
      const control = new FormControl([1, 2]);
      expect(validator(control)).toBeNull();
    });

    it('should return an error if array length is less than min length', () => {
      const validator = minArrayLengthValidator(2);
      const control = new FormControl([1]);
      expect(validator(control)).toEqual({ minLength: 'Array length must be at least 2' });
    });

    it('should return an error if value is not an array', () => {
      const validator = minArrayLengthValidator(2);
      const control = new FormControl('not an array');
      expect(validator(control)).toEqual({ minLength: 'Array length must be at least 2' });
    });
  });

  describe('notEmptyValidator', () => {
    it('should return null if array is not empty', () => {
      const validator = notEmptyValidator();
      const control = new FormControl([1]);
      expect(validator(control)).toBeNull();
    });

    it('should return an error if array is empty', () => {
      const validator = notEmptyValidator();
      const control = new FormControl([]);
      expect(validator(control)).toEqual({ minLength: 'Array length must be at least 1' });
    });

    it('should return an error if value is not an array', () => {
      const validator = notEmptyValidator();
      const control = new FormControl('not an array');
      expect(validator(control)).toEqual({ minLength: 'Array length must be at least 1' });
    });
  });
});
