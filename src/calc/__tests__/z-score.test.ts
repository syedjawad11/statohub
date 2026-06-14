import { describe, expect, it } from 'vitest';
import { zScore } from '../z-score';

describe('zScore', () => {
  it('returns the z-score for the reference values', () => {
    expect(zScore({ x: 7, mean: 5, sd: 2 }).value).toBe(1);
  });

  it('returns an error for invalid input', () => {
    const result = zScore({ x: 7, mean: 5, sd: 0 });

    expect(result.value).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
