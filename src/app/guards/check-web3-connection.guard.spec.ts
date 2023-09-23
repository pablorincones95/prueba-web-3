import { TestBed } from '@angular/core/testing';

import { CheckWeb3ConnectionGuard } from './check-web3-connection.guard';

describe('CheckWeb3ConnectionGuard', () => {
  let guard: CheckWeb3ConnectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckWeb3ConnectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
