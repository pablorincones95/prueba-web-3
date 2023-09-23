import { TestBed } from '@angular/core/testing';

import { DailyCutService } from './daily-cut.service';

describe('DailyCutService', () => {
  let service: DailyCutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyCutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
