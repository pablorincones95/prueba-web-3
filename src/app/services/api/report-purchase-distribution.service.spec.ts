import { TestBed } from '@angular/core/testing';

import { ReportPurchaseDistributionService } from './report-purchase-distribution.service';

describe('ReportPurchaseDistributionService', () => {
  let service: ReportPurchaseDistributionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportPurchaseDistributionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
