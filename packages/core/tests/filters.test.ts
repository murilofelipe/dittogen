import { describe, it, expect } from 'vitest';
import { CandidateFilter } from '../src/filters/index';
import { CandidateName } from '../src/models/index';

describe('CandidateFilter', () => {
  const createCandidate = (val: string): CandidateName => ({
    value: val,
    normalized: val.toLowerCase(),
  });

  it('should filter by min and max length', () => {
    const filter = new CandidateFilter({ minLength: 4, maxLength: 6 });
    expect(filter.isValid(createCandidate('abc'))).toBe(false);
    expect(filter.isValid(createCandidate('abcd'))).toBe(true);
    expect(filter.isValid(createCandidate('abcdef'))).toBe(true);
    expect(filter.isValid(createCandidate('abcdefg'))).toBe(false);
  });

  it('should filter stopwords and remove accents', () => {
    const filter = new CandidateFilter({ stopwords: ['nao'] });
    expect(filter.isValid(createCandidate('Não'))).toBe(false);
    expect(filter.isValid(createCandidate('nao'))).toBe(false);
    expect(filter.isValid(createCandidate('sim'))).toBe(true);
  });

  it('should reject 3 repeated characters', () => {
    const filter = new CandidateFilter({});
    expect(filter.isValid(createCandidate('heello'))).toBe(true);
    expect(filter.isValid(createCandidate('heeello'))).toBe(false);
    expect(filter.isValid(createCandidate('aaab'))).toBe(false);
  });

  it('should apply custom regex exclusions', () => {
    const filter = new CandidateFilter({ excludeRegex: [/shit/, /fuck/] });
    expect(filter.isValid(createCandidate('bullshit'))).toBe(false);
    expect(filter.isValid(createCandidate('hello'))).toBe(true);
  });
});
