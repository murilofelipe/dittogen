import { describe, it, expect } from 'vitest';
import { MockDomainProvider, MockTrademarkProvider } from '../src/providers/index';

describe('Providers', () => {
  it('should mock domain checking', async () => {
    const provider = new MockDomainProvider();
    const res = await provider.checkDomain('test', 'com'); // len 4 + 3 = 7 (odd => occupied)
    expect(res.status).toBe('occupied');

    const res2 = await provider.checkDomain('test2', 'com'); // len 5 + 3 = 8 (even => available)
    expect(res2.status).toBe('available');
  });

  it('should mock trademark checking with disclaimer', async () => {
    const provider = new MockTrademarkProvider();
    const res = await provider.checkTrademark('Aero', 'US'); // contains 'a' and 'o' => occupied
    expect(res.status).toBe('occupied');
    expect(res.disclaimer).toBeDefined();
    
    const res2 = await provider.checkTrademark('Zen', 'US');
    expect(res2.status).toBe('available');
  });
});
