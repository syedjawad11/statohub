import { zCritical } from "./_stats-math";
import type { CalcResult } from "./types";

export interface ConfidenceIntervalInput {
  mean: number;
  sd: number;
  n: number;
  level: string;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function confidenceInterval(input: ConfidenceIntervalInput): CalcResult {
  const mean = input?.mean;
  const sd = input?.sd;
  const n = input?.n;
  const level = Number(input?.level);

  if (!isFiniteNumber(mean) || !isFiniteNumber(sd) || !isFiniteNumber(n) || !Number.isFinite(level)) {
    return { value: null, error: "Mean, standard deviation, sample size, and level must be valid." };
  }

  if (sd < 0) {
    return { value: null, error: "Standard deviation cannot be negative." };
  }

  if (!Number.isInteger(n) || n < 1) {
    return { value: null, error: "Sample size must be a whole number of at least 1." };
  }

  const z = zCritical(level);
  if (!Number.isFinite(z)) {
    return { value: null, error: "Confidence level must be between 0 and 1." };
  }

  const standardError = sd / Math.sqrt(n);
  const margin = z * standardError;

  return {
    value: margin,
    outputs: {
      margin,
      lower: mean - margin,
      upper: mean + margin,
      standardError,
      z,
    },
  };
}
