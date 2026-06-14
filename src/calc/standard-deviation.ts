import type { CalcResult } from "./types";

export interface StandardDeviationInput {
  values: number[];
}

function cleanValues(input: unknown): number[] | null {
  if (
    !input ||
    typeof input !== "object" ||
    !Array.isArray((input as StandardDeviationInput).values)
  ) {
    return null;
  }

  const values = (input as StandardDeviationInput).values;
  return values.length >= 2 && values.every(Number.isFinite) ? values : null;
}

export function standardDeviation(input: StandardDeviationInput): CalcResult {
  const values = cleanValues(input);

  if (!values) {
    return {
      value: null,
      error: "Standard deviation requires at least two finite numeric values.",
    };
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDiffs = values.reduce(
    (sum, value) => sum + (value - mean) ** 2,
    0,
  );
  const population = Math.sqrt(squaredDiffs / values.length);
  const sample = Math.sqrt(squaredDiffs / (values.length - 1));

  return {
    value: sample,
    outputs: {
      sample,
      population,
    },
  };
}
