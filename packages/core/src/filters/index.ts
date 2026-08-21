import { CandidateName } from '../models/index';

export interface FilterOptions {
  minLength?: number;
  maxLength?: number;
  stopwords?: string[];
  excludeRegex?: RegExp[];
}

export class CandidateFilter {
  private options: FilterOptions;

  constructor(options: FilterOptions) {
    this.options = options;
  }

  private removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  isValid(candidate: CandidateName): boolean {
    const word = candidate.normalized;
    const noAccents = this.removeAccents(word);

    if (this.options.minLength && noAccents.length < this.options.minLength) return false;
    if (this.options.maxLength && noAccents.length > this.options.maxLength) return false;

    // Reject 3 or more of the same character in a row
    if (/(.)\1{2,}/.test(noAccents)) return false;

    if (this.options.stopwords) {
      if (this.options.stopwords.includes(noAccents)) return false;
    }

    if (this.options.excludeRegex) {
      for (const regex of this.options.excludeRegex) {
        if (regex.test(noAccents)) return false;
      }
    }

    return true;
  }

  filterList(candidates: CandidateName[]): CandidateName[] {
    return candidates.filter(c => this.isValid(c));
  }
}
