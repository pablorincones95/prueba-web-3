import { TestBed } from '@angular/core/testing';

import { CronjobIndicatorsService } from './cronjob-indicators.service';

describe('CronjobIndicatorsService', () => {
  let service: CronjobIndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronjobIndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
