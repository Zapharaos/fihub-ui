import { TestBed } from '@angular/core/testing';

import { BrokerDataService } from '@core/services/broker-data.service';

describe('BrokerDataService', () => {
  let service: BrokerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
