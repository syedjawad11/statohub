import { pairedRegressionSums } from "./_regression-core";
import type { CalcResult } from "./types";

export interface LinearRegressionInput {
  x: number[];
  y: number[];
}

function formatCoefficient(value: number): string {
  return Number(value.toFixed(4)).toString();
}

export function linearRegression(input: LinearRegressionInput): CalcResult {
  const sums = pairedRegressionSums(input?.x, input?.y);

  if (!sums) {
    return { value: null, error: "x and y must be finite numeric lists with the same length and at least two paired values." };
  }

  if (sums.Sxx === 0) {
    return { value: null, error: "Linear regression requires variation in x." };
  }

  const slope = sums.Sxy / sums.Sxx;
  const intercept = sums.meanY - slope * sums.meanX;
  const r = sums.Syy === 0 ? 0 : sums.Sxy / Math.sqrt(sums.Sxx * sums.Syy);

  return {
    value: slope,
    outputs: {
      slope,
      intercept,
      r,
      rSquared: r * r,
      n: sums.n,
    },
    text: `y = ${formatCoefficient(intercept)} + ${formatCoefficient(slope)}x`,
  };
}
