import type { CalcResult } from "./types";

export interface MedianInput {
  values: number[];
}

function getValidValues(input: MedianInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  return input.values.every((value) => Number.isFinite(value)) ? input.values : null;
}

export function median(input: MedianInput): CalcResult {
  const values = getValidValues(input);

  if (!values) {
    return { value: null, error: "Median requires a non-empty array of finite numbers." };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return { value: sorted[middle] };
  }

  return { value: (sorted[middle - 1] + sorted[middle]) / 2 };
}
