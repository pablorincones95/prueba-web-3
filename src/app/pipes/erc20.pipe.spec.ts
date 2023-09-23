import { Erc20Pipe } from './erc20.pipe';

describe('Erc20Pipe', () => {
  it('create an instance', () => {
    const pipe = new Erc20Pipe();
    expect(pipe).toBeTruthy();
  });
});
