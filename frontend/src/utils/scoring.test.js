import { describe, it, expect } from 'vitest';
import { computeScores, getIndividualScores } from './scoring';

describe('Scoring Utilities', () => {
  it('should compute overall score as 100% for identical answers', () => {
    const mockAnswers = {};
    for (let i = 1; i <= 25; i++) {
      mockAnswers[i] = 0;
    }
    const { overall } = computeScores(mockAnswers, mockAnswers);
    expect(overall).toBe(100);
  });

  it('should compute overall score as lower for divergent answers', () => {
    const aA = { 1: 0 };
    const aB = { 1: 3 };
    const { overall } = computeScores(aA, aB);
    expect(overall).toBeLessThan(100);
  });

  it('should compute individual scores correctly', () => {
    const answers = { 1: 0 }; // 0 maps to 100
    const scores = getIndividualScores(answers);
    expect(Object.values(scores)[0]).toBeGreaterThan(0);
  });

});
