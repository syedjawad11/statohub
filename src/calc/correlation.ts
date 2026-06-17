import { pairedRegressionSums } from "./_regression-core";
import type { CalcResult } from "./types";

export interface CorrelationInput {
  x: number[];
  y: number[];
}

export function correlation(input: CorrelationInput): CalcResult {
  const sums = pairedRegressionSums(input?.x, input?.y);

  if (!sums) {
    return { value: null, error: "x and y must be finite numeric lists with the same length and at least two paired values." };
  }

  if (sums.Sxx === 0 || sums.Syy === 0) {
    return { value: null, error: "Correlation requires variation in both x and y." };
  }

  const r = sums.Sxy / Math.sqrt(sums.Sxx * sums.Syy);

  return {
    value: r,
    outputs: {
      r,
      rSquared: r * r,
      n: sums.n,
    },
  };
}
