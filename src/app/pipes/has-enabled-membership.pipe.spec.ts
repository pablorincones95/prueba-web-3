import { HasEnabledMembershipPipe } from './has-enabled-membership.pipe';

describe('HasEnabledMembershipPipe', () => {
  it('create an instance', () => {
    const pipe = new HasEnabledMembershipPipe();
    expect(pipe).toBeTruthy();
  });
});
