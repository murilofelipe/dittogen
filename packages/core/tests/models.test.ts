import { describe, it, expect } from 'vitest';
import { CandidateName } from '../src/models/index';

describe('Models', () => {
  it('should allow creating a CandidateName object', () => {
    const candidate: CandidateName = {
      value: 'Dittogen',
      normalized: 'dittogen',
    };
    expect(candidate.value).toBe('Dittogen');
  });
});
