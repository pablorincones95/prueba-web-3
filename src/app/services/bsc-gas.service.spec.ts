import { TestBed } from '@angular/core/testing';

import { BscGasService } from './bsc-gas.service';

describe('BscGasService', () => {
  let service: BscGasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BscGasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
