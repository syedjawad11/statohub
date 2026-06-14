import type { CalcResult } from "./types";

export interface MeanInput {
  values: number[];
}

function getValidValues(input: MeanInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  return input.values.every((value) => Number.isFinite(value)) ? input.values : null;
}

export function mean(input: MeanInput): CalcResult {
  const values = getValidValues(input);

  if (!values) {
    return { value: null, error: "Mean requires a non-empty array of finite numbers." };
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return { value: sum / values.length };
}
