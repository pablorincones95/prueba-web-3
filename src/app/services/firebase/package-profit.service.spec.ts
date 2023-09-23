import { TestBed } from '@angular/core/testing';

import { PackageProfitService } from './package-profit.service';

describe('PackageProfitService', () => {
  let service: PackageProfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageProfitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
