import {TestBed} from '@angular/core/testing';

import {NotificationUtilsService} from './notification-utils.service';

describe('ToastService', () => {
  let service: NotificationUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
