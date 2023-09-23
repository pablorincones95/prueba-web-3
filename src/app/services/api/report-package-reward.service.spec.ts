import { TestBed } from '@angular/core/testing';

import { ReportPackageRewardService } from './report-package-reward.service';

describe('ReportPackageRewardService', () => {
  let service: ReportPackageRewardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportPackageRewardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
