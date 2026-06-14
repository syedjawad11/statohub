import type { CalcResult } from './types';

export interface ZScoreInput {
  x: number;
  mean: number;
  sd: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function zScore(input: ZScoreInput): CalcResult {
  const x = input?.x;
  const mean = input?.mean;
  const sd = input?.sd;

  if (!isFiniteNumber(x) || !isFiniteNumber(mean) || !isFiniteNumber(sd)) {
    return { value: null, error: 'x, mean, and sd must be finite numbers.' };
  }

  if (sd <= 0) {
    return { value: null, error: 'Standard deviation must be greater than zero.' };
  }

  return { value: (x - mean) / sd };
}
