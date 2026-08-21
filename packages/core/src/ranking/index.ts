import { CandidateName } from '../models/index';
import { areSimilar } from '../similarity/index';

export class Ranker {
  rankAndSelect(candidates: CandidateName[], topN: number, enforceDiversity: boolean = true): CandidateName[] {
    // Sort by score descending
    const sorted = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

    if (!enforceDiversity) {
      return sorted.slice(0, topN);
    }

    const selected: CandidateName[] = [];
    
    for (const candidate of sorted) {
      if (selected.length >= topN) break;
      
      const isTooSimilar = selected.some(s => areSimilar(s.normalized, candidate.normalized, 2));
      
      if (!isTooSimilar) {
        selected.push(candidate);
      }
    }

    return selected;
  }
}
