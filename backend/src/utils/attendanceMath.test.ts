import { describe, it, expect } from 'vitest';
import { calculatePercentage, countPresentAbsent } from '../utils/attendanceMath';

describe('attendanceMath', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(3, 4)).toBe(75);
    expect(calculatePercentage(0, 0)).toBe(0);
    expect(calculatePercentage(9, 10)).toBe(90);
  });

  it('counts present and absent records', () => {
    const records = [
      { Status: 'Present' },
      { Status: 'Present' },
      { Status: 'Absent' },
      { Status: 'Present' },
    ];

    const result = countPresentAbsent(records);
    expect(result.present).toBe(3);
    expect(result.absent).toBe(1);
    expect(result.total).toBe(4);
    expect(result.percentage).toBe(75);
  });
});
