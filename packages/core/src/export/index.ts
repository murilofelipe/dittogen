import { CandidateName } from '../models/index';

export class Exporter {
  static toJson(candidates: CandidateName[]): string {
    return JSON.stringify(candidates, null, 2);
  }

  static toCsv(candidates: CandidateName[]): string {
    if (candidates.length === 0) return '';
    
    const header = ['Name', 'Score', 'Pronunciation', 'Memorability', 'Spelling'].join(',');
    const rows = candidates.map(c => {
      const score = c.score || 0;
      const scores = c.scores || { pronunciation: 0, memorability: 0, spelling: 0 };
      return `${c.value},${score},${scores.pronunciation},${scores.memorability},${scores.spelling}`;
    });

    return [header, ...rows].join('\n');
  }
}
