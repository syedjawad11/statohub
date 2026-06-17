import { studentTCdf } from "./_stats-math";
import type { CalcResult } from "./types";

export interface TTestInput {
  sampleMean: number;
  populationMean: number;
  sampleSd: number;
  n: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function tTest(input: TTestInput): CalcResult {
  if (
    !isFiniteNumber(input?.sampleMean)
    || !isFiniteNumber(input.populationMean)
    || !isFiniteNumber(input.sampleSd)
    || !isFiniteNumber(input.n)
  ) {
    return { value: null, error: "Sample mean, hypothesized mean, sample standard deviation, and n must be finite numbers." };
  }

  if (input.sampleSd <= 0) {
    return { value: null, error: "Sample standard deviation must be greater than zero." };
  }

  if (!Number.isInteger(input.n) || input.n < 2) {
    return { value: null, error: "Sample size n must be an integer of at least 2." };
  }

  const df = input.n - 1;
  const standardError = input.sampleSd / Math.sqrt(input.n);
  const t = (input.sampleMean - input.populationMean) / standardError;
  const pValue = 2 * (1 - studentTCdf(Math.abs(t), df));

  return {
    value: t,
    outputs: {
      t,
      df,
      pValue,
      standardError,
    },
  };
}
