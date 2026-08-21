import { describe, it, expect } from 'vitest';
import { NameGenerator, CandidateFilter, Scorer, Ranker, Exporter } from '../src/index';

describe('Integration', () => {
  it('should generate, filter, score and rank', () => {
    const generator = new NameGenerator({
      roots: ['omni', 'flex', 'nova', 'zen', 'core'],
      suffixes: ['io', 'ify', 'gen', 'us', 'a'],
      seed: 42,
      count: 20
    });
    const candidates = generator.generate();

    const filter = new CandidateFilter({ minLength: 4, maxLength: 8 });
    const filtered = filter.filterList(candidates);

    const scorer = new Scorer();
    const scored = scorer.scoreList(filtered);

    const ranker = new Ranker();
    const top = ranker.rankAndSelect(scored, 3, true);

    expect(top.length).toBeLessThanOrEqual(3);
    if (top.length > 0) {
      expect(top[0].score).toBeDefined();
    }
    
    const csv = Exporter.toCsv(top);
    expect(csv).toContain('Name,Score,Pronunciation,Memorability,Spelling');
  });
});
