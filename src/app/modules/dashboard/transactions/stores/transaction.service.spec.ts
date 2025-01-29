import { TestBed } from '@angular/core/testing';

import { TransactionStore } from './transaction.service';

describe('TransactionStore', () => {
  let service: TransactionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
