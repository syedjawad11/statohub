import type { CalcResult } from "./types";

export interface RangeInput {
  values: number[];
}

function getValidValues(input: RangeInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  return input.values.every((value) => Number.isFinite(value)) ? input.values : null;
}

export function range(input: RangeInput): CalcResult {
  const values = getValidValues(input);

  if (!values) {
    return { value: null, error: "Range requires a non-empty array of finite numbers." };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  return { value: max - min, outputs: { min, max } };
}
