import { CandidateName, ScoreBreakdown } from '../models/index';

export class Scorer {
  score(candidate: CandidateName): CandidateName {
    const word = candidate.normalized;
    const len = word.length;
    
    // Length scoring (ideal is 5-8 chars)
    let lengthScore = 10;
    if (len < 5) lengthScore -= (5 - len) * 1.5;
    if (len > 8) lengthScore -= (len - 8) * 1.5;
    lengthScore = Math.max(0, Math.min(10, lengthScore));

    // Vowel / consonant ratio
    const vowels = word.match(/[aeiouy]/g)?.length || 0;
    const consonants = len - vowels;
    let ratioScore = 10;
    if (vowels === 0 || consonants === 0) ratioScore = 2;
    else if (vowels / len > 0.6 || consonants / len > 0.7) ratioScore = 6;

    const pronunciation = ratioScore;
    const memorability = lengthScore;
    const spelling = (ratioScore + lengthScore) / 2;
    
    const totalScore = (pronunciation * 3.5 + memorability * 3.5 + spelling * 3.0);

    const scores: ScoreBreakdown = {
      pronunciation: parseFloat(pronunciation.toFixed(1)),
      memorability: parseFloat(memorability.toFixed(1)),
      spelling: parseFloat(spelling.toFixed(1)),
    };

    return {
      ...candidate,
      score: parseFloat(totalScore.toFixed(1)),
      scores
    };
  }

  scoreList(candidates: CandidateName[]): CandidateName[] {
    return candidates.map(c => this.score(c));
  }
}
