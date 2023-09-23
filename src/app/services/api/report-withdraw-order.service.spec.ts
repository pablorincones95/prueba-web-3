import { TestBed } from '@angular/core/testing';

import { ReportWithdrawOrderService } from './report-withdraw-order.service';

describe('ReportWithdrawOrderService', () => {
  let service: ReportWithdrawOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportWithdrawOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
