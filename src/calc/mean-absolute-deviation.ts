import type { CalcResult } from "./types";

export interface MeanAbsoluteDeviationInput {
  values: number[];
}

function getValidValues(input: MeanAbsoluteDeviationInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  return input.values.every((value) => Number.isFinite(value)) ? input.values : null;
}

export function meanAbsoluteDeviation(input: MeanAbsoluteDeviationInput): CalcResult {
  const values = getValidValues(input);

  if (!values) {
    return { value: null, error: "Mean absolute deviation requires a non-empty array of finite numbers." };
  }

  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const totalDeviation = values.reduce((total, value) => total + Math.abs(value - mean), 0);

  return { value: totalDeviation / values.length };
}
