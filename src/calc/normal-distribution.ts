import { normalCdf } from "./_stats-math";
import type { CalcResult } from "./types";

export interface NormalDistributionInput {
  mean: number;
  sd: number;
  x: number;
  upper: number;
  mode: string;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function normalDistribution(input: NormalDistributionInput): CalcResult {
  const mean = input?.mean;
  const sd = input?.sd;
  const x = input?.x;
  const upper = input?.upper;

  if (!isFiniteNumber(mean) || !isFiniteNumber(sd) || !isFiniteNumber(x)) {
    return { value: null, error: "Mean, standard deviation, and x must be finite numbers." };
  }

  if (sd <= 0) {
    return { value: null, error: "Standard deviation must be greater than zero." };
  }

  const z = (x - mean) / sd;
  const cdf = normalCdf(x, mean, sd);

  if (input.mode === "lessThan") {
    return { value: cdf, outputs: { probability: cdf, z } };
  }

  if (input.mode === "greaterThan") {
    const probability = 1 - cdf;
    return { value: probability, outputs: { probability, z } };
  }

  if (input.mode === "between") {
    if (!isFiniteNumber(upper)) {
      return { value: null, error: "Upper bound must be a finite number." };
    }

    if (upper <= x) {
      return { value: null, error: "Upper bound must be greater than the lower x value." };
    }

    const zUpper = (upper - mean) / sd;
    const probability = normalCdf(upper, mean, sd) - cdf;
    return { value: probability, outputs: { probability, zLower: z, zUpper } };
  }

  return { value: null, error: "Choose less than, greater than, or between." };
}
