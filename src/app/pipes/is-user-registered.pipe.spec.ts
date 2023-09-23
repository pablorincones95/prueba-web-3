import { IsUserRegisteredPipe } from './is-user-registered.pipe';

describe('IsUserRegisteredPipe', () => {
  it('create an instance', () => {
    const pipe = new IsUserRegisteredPipe();
    expect(pipe).toBeTruthy();
  });
});
