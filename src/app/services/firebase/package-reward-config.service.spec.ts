import { TestBed } from '@angular/core/testing';

import { PackageRewardConfigService } from './package-reward-config.service';

describe('PackageRewardConfigService', () => {
  let service: PackageRewardConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageRewardConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
