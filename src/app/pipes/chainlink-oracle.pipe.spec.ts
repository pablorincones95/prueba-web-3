import { ChainlinkOraclePipe } from './chainlink-oracle.pipe';

describe('ChainlinkOraclePipe', () => {
  it('create an instance', () => {
    const pipe = new ChainlinkOraclePipe();
    expect(pipe).toBeTruthy();
  });
});
