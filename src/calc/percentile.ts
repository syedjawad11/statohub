import type { CalcResult } from "./types";

export interface PercentileInput {
  values: number[];
  p: number;
}

function cleanInput(input: unknown): PercentileInput | null {
  if (
    !input ||
    typeof input !== "object" ||
    !Array.isArray((input as PercentileInput).values) ||
    !Number.isFinite((input as PercentileInput).p)
  ) {
    return null;
  }

  const { values, p } = input as PercentileInput;
  if (values.length === 0 || !values.every(Number.isFinite) || p < 0 || p > 100) {
    return null;
  }

  return { values, p };
}

export function type7Percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 1) {
    return sortedValues[0];
  }

  // Hyndman-Fan Type 7 linear interpolation percentile method.
  const position = (p / 100) * (sortedValues.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);

  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }

  const fraction = position - lowerIndex;
  return (
    sortedValues[lowerIndex] +
    (sortedValues[upperIndex] - sortedValues[lowerIndex]) * fraction
  );
}

export function percentile(input: PercentileInput): CalcResult {
  const cleaned = cleanInput(input);

  if (!cleaned) {
    return {
      value: null,
      error: "Percentile requires finite numeric values and p between 0 and 100.",
    };
  }

  const sortedValues = [...cleaned.values].sort((a, b) => a - b);
  const value = type7Percentile(sortedValues, cleaned.p);
  const q1 = type7Percentile(sortedValues, 25);
  const q2 = type7Percentile(sortedValues, 50);
  const q3 = type7Percentile(sortedValues, 75);

  return {
    value,
    outputs: {
      q1,
      q2,
      q3,
      iqr: q3 - q1,
    },
  };
}
