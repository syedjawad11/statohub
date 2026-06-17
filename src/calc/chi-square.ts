import { chiSquareCdf } from "./_stats-math";
import type { CalcResult } from "./types";

export interface ChiSquareInput {
  observed: number[];
  expected: number[];
}

function isFiniteList(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item));
}

export function chiSquare(input: ChiSquareInput): CalcResult {
  const observed = input?.observed;
  const expected = input?.expected;

  if (!isFiniteList(observed) || !isFiniteList(expected) || observed.length !== expected.length || observed.length < 2) {
    return { value: null, error: "Observed and expected lists must be finite numeric lists with the same length and at least two categories." };
  }

  if (expected.some((value) => value <= 0)) {
    return { value: null, error: "Every expected count must be greater than zero." };
  }

  const statistic = observed.reduce((sum, observedValue, index) => {
    const difference = observedValue - expected[index];
    return sum + (difference * difference) / expected[index];
  }, 0);
  const df = observed.length - 1;
  const pValue = 1 - chiSquareCdf(statistic, df);

  return {
    value: statistic,
    outputs: {
      statistic,
      df,
      pValue,
    },
  };
}
