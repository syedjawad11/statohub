import { describe, expect, it } from 'vitest';
import { weightedMean } from '../weighted-mean';

describe('weightedMean', () => {
  it('returns the weighted mean for the reference values', () => {
    expect(weightedMean({ values: [1, 2, 3, 4], weights: [4, 3, 2, 1] }).value).toBe(2);
  });

  it('returns an error for invalid input', () => {
    const result = weightedMean({ values: [1, 2], weights: [1] });

    expect(result.value).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
