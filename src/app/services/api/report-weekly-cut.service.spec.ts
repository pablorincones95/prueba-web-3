import { TestBed } from '@angular/core/testing';

import { ReportWeeklyCutService } from './report-weekly-cut.service';

describe('ReportWeeklyCutService', () => {
  let service: ReportWeeklyCutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportWeeklyCutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
