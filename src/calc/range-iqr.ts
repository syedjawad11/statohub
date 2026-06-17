import { type7Percentile } from "./percentile";
import type { CalcResult } from "./types";

export interface RangeIqrInput {
  values: number[];
}

function getSortedValues(input: RangeIqrInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  if (!input.values.every(Number.isFinite)) {
    return null;
  }

  return [...input.values].sort((a, b) => a - b);
}

export function rangeIqr(input: RangeIqrInput): CalcResult {
  const values = getSortedValues(input);

  if (!values) {
    return { value: null, error: "Range and IQR require a non-empty array of finite numbers." };
  }

  const min = values[0];
  const max = values[values.length - 1];
  const spread = max - min;
  const q1 = type7Percentile(values, 25);
  const q2 = type7Percentile(values, 50);
  const q3 = type7Percentile(values, 75);
  const iqr = q3 - q1;

  return {
    value: iqr,
    outputs: { min, max, range: spread, q1, q2, q3, iqr },
  };
}
