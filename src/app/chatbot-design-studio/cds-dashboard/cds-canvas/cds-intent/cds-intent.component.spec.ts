import { isLiveIntent } from './cds-intent.component';

describe('isLiveIntent', () => {
  it('activates only the block reported by the flow log', () => {
    expect(isLiveIntent({ intent: { intent_id: 'cc-menu' } as any }, 'cc-menu')).toBeTrue();
    expect(isLiveIntent({ intent: { intent_id: 'cc-plans' } as any }, 'cc-menu')).toBeFalse();
    expect(isLiveIntent(null, 'cc-menu')).toBeFalse();
  });
});
