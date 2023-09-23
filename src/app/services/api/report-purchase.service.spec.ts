import { TestBed } from '@angular/core/testing';

import { ReportPurchaseService } from './report-purchase.service';

describe('ReportPurchaseService', () => {
  let service: ReportPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
