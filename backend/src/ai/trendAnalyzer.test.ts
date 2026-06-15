import { describe, it, expect } from 'vitest';
import { analyzeDeclineTrend } from '../ai/trendAnalyzer';

describe('trendAnalyzer', () => {
  it('returns high score for continuous decline', () => {
    const data = [
      { month: 'Jan', attendance: 90 },
      { month: 'Feb', attendance: 84 },
      { month: 'Mar', attendance: 79 },
      { month: 'Apr', attendance: 73 },
    ];

    const score = analyzeDeclineTrend(data);
    expect(score).toBeGreaterThan(0);
  });

  it('returns 0 for insufficient data', () => {
    expect(analyzeDeclineTrend([{ month: 'Jan', attendance: 90 }])).toBe(0);
    expect(analyzeDeclineTrend([])).toBe(0);
  });

  it('returns lower score for stable attendance', () => {
    const declining = analyzeDeclineTrend([
      { month: 'Jan', attendance: 90 },
      { month: 'Feb', attendance: 84 },
      { month: 'Mar', attendance: 79 },
    ]);

    const stable = analyzeDeclineTrend([
      { month: 'Jan', attendance: 90 },
      { month: 'Feb', attendance: 91 },
      { month: 'Mar', attendance: 90 },
    ]);

    expect(declining).toBeGreaterThan(stable);
  });
});
