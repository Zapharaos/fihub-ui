import { TestBed } from '@angular/core/testing';

import { PasswordStore } from './password.service';

describe('PasswordStore', () => {
  let service: PasswordStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
