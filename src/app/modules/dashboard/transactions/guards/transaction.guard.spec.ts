import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { transactionGuard } from './transaction.guard';

describe('transactionGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => transactionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
