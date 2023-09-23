import { IsBasicPackagePipe } from './is-basic-package.pipe';

describe('IsBasicPackagePipe', () => {
  it('create an instance', () => {
    const pipe = new IsBasicPackagePipe();
    expect(pipe).toBeTruthy();
  });
});
