import { describe, it, expect } from 'vitest';
import {
  scoreConsecutiveAbsences,
  scoreProximityToThreshold,
  scoreVariance,
  computeRiskScore,
  predictNextMonthAttendance,
} from '../ai/riskScorer';

describe('riskScorer', () => {
  it('scores high for consecutive absences', () => {
    const records = [
      { AttendanceDate: new Date('2026-01-01'), Status: 'Absent' },
      { AttendanceDate: new Date('2026-01-02'), Status: 'Absent' },
      { AttendanceDate: new Date('2026-01-03'), Status: 'Absent' },
      { AttendanceDate: new Date('2026-01-04'), Status: 'Absent' },
    ];

    expect(scoreConsecutiveAbsences(records)).toBe(100);
  });

  it('scores high proximity when near 75% threshold', () => {
    expect(scoreProximityToThreshold(76)).toBeGreaterThan(scoreProximityToThreshold(90));
    expect(scoreProximityToThreshold(76)).toBe(90);
    expect(scoreProximityToThreshold(74)).toBeGreaterThan(0);
  });

  it('scores high variance for unstable attendance', () => {
    expect(scoreVariance([90, 60, 85, 55])).toBeGreaterThan(scoreVariance([88, 90, 89, 91]));
  });

  it('computes weighted risk score', () => {
    const score = computeRiskScore(80, 70, 60, 50);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('predicts declining attendance', () => {
    const monthly = [
      { attendance: 90 },
      { attendance: 84 },
      { attendance: 79 },
      { attendance: 73 },
    ];

    const predicted = predictNextMonthAttendance(monthly, 73);
    expect(predicted).toBeLessThan(73);
  });
});
