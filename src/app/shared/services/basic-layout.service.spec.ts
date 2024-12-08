import { TestBed } from '@angular/core/testing';

import { BasicLayoutService } from './basic-layout.service';

describe('BasicLayoutService', () => {
  let service: BasicLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
