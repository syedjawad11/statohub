import type { CalcResult } from "./types";

export interface VarianceInput {
  values: number[];
}

function cleanValues(input: unknown): number[] | null {
  if (
    !input ||
    typeof input !== "object" ||
    !Array.isArray((input as VarianceInput).values)
  ) {
    return null;
  }

  const values = (input as VarianceInput).values;
  return values.length >= 2 && values.every(Number.isFinite) ? values : null;
}

export function variance(input: VarianceInput): CalcResult {
  const values = cleanValues(input);

  if (!values) {
    return {
      value: null,
      error: "Variance requires at least two finite numeric values.",
    };
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDiffs = values.reduce(
    (sum, value) => sum + (value - mean) ** 2,
    0,
  );
  const population = squaredDiffs / values.length;
  const sample = squaredDiffs / (values.length - 1);

  return {
    value: sample,
    outputs: {
      sample,
      population,
    },
  };
}
