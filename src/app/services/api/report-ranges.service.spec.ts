import { TestBed } from '@angular/core/testing';

import { ReportRangesService } from './report-ranges.service';

describe('ReportRangesService', () => {
  let service: ReportRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportRangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
