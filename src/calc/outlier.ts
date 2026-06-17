import { type7Percentile } from "./percentile";
import type { CalcResult } from "./types";

export interface OutlierInput {
  values: number[];
}

function getSortedValues(input: OutlierInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  if (!input.values.every(Number.isFinite)) {
    return null;
  }

  return [...input.values].sort((a, b) => a - b);
}

export function outlier(input: OutlierInput): CalcResult {
  const values = getSortedValues(input);

  if (!values) {
    return { value: null, error: "Outlier detection requires a non-empty array of finite numbers." };
  }

  const q1 = type7Percentile(values, 25);
  const q3 = type7Percentile(values, 75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = values.filter((value) => value < lowerFence || value > upperFence);

  return {
    value: outliers.length,
    outputs: { q1, q3, iqr, lowerFence, upperFence },
    list: outliers,
  };
}
