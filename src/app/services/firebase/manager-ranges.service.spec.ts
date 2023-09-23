import { TestBed } from '@angular/core/testing';

import { ManagerRangesService } from './manager-ranges.service';

describe('ManagerRangesService', () => {
  let service: ManagerRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerRangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
