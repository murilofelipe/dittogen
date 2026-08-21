import { CandidateName } from '../models/index';
import { PRNG } from '../utils/prng';

export interface GeneratorConfig {
  roots: string[];
  suffixes: string[];
  seed?: number;
  count?: number;
}

export class NameGenerator {
  private config: GeneratorConfig;
  private prng: PRNG;

  constructor(config: GeneratorConfig) {
    this.config = config;
    this.prng = new PRNG(config.seed);
  }

  private capitalize(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  generate(): CandidateName[] {
    const { roots, suffixes, count = 10 } = this.config;
    const candidates: CandidateName[] = [];
    
    if (roots.length === 0 || suffixes.length === 0) {
      return candidates;
    }

    const generated = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (candidates.length < count && attempts < maxAttempts) {
      attempts++;
      
      const root = this.prng.pick(roots);
      const suffix = this.prng.pick(suffixes);
      
      const combined = `${root}${suffix}`;
      const normalized = combined.toLowerCase();

      if (!generated.has(normalized)) {
        generated.add(normalized);
        candidates.push({
          value: this.capitalize(combined),
          normalized,
          metadata: {
            roots: [root],
            suffixes: [suffix]
          }
        });
      }
    }

    return candidates;
  }
}
