import { normalCdf, studentTCdf } from "./_stats-math";
import type { CalcResult } from "./types";

export interface PValueInput {
  statistic: number;
  df?: number;
  distribution: string;
  tail: string;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function pValue(input: PValueInput): CalcResult {
  if (!isFiniteNumber(input?.statistic)) {
    return { value: null, error: "Test statistic must be a finite number." };
  }

  let cdf: number;
  const outputs: Record<string, number> = { statistic: input.statistic };

  if (input.distribution === "z") {
    cdf = normalCdf(input.statistic);
  } else if (input.distribution === "t") {
    if (!isFiniteNumber(input.df) || input.df < 1) {
      return { value: null, error: "Student-t p-values require degrees of freedom of at least 1." };
    }
    cdf = studentTCdf(input.statistic, input.df);
    outputs.df = input.df;
  } else {
    return { value: null, error: "Choose z or Student-t distribution." };
  }

  if (input.tail === "left") {
    return { value: cdf, outputs };
  }
  if (input.tail === "right") {
    return { value: 1 - cdf, outputs };
  }
  if (input.tail === "two") {
    const oneSided = input.statistic < 0 ? cdf : 1 - cdf;
    return { value: Math.min(1, 2 * oneSided), outputs };
  }

  return { value: null, error: "Choose left, right, or two-tailed." };
}
