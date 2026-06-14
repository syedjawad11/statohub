import type { CalcResult } from './types';

export interface WeightedMeanInput {
  values: number[];
  weights: number[];
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function weightedMean(input: WeightedMeanInput): CalcResult {
  const values = input?.values;
  const weights = input?.weights;

  if (!Array.isArray(values) || !Array.isArray(weights) || values.length === 0) {
    return { value: null, error: 'Values and weights must be non-empty arrays.' };
  }

  if (values.length !== weights.length) {
    return { value: null, error: 'Values and weights must have the same length.' };
  }

  if (!values.every(isFiniteNumber) || !weights.every(isFiniteNumber)) {
    return { value: null, error: 'Values and weights must contain only finite numbers.' };
  }

  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  if (weightSum === 0) {
    return { value: null, error: 'Weight sum must not be zero.' };
  }

  const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);

  return { value: weightedSum / weightSum };
}
