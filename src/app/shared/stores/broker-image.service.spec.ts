import { TestBed } from '@angular/core/testing';

import { BrokerImageStore } from './broker-image.service';

describe('BrokerImageStore', () => {
  let service: BrokerImageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerImageStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
