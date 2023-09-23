import { TestBed } from '@angular/core/testing';

import { UserRankService } from './user-rank.service';

describe('UserRankService', () => {
  let service: UserRankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
