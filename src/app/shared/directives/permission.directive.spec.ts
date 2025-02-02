import {PermissionDirective} from './permission.directive';

describe('PermissionDirective', () => {
  it('should create an instance', () => {
    // @ts-expect-error: necessary for test
    const directive = new PermissionDirective();
    expect(directive).toBeTruthy();
  });
});
