import {
  bigIntToSafeNumber,
  combinationBigInt,
  isNonNegativeInteger,
  permutationBigInt,
} from "./combinatorics-core";
import type { CalcResult } from "./types";

export interface CombinationInput {
  n: number;
  r: number;
  mode: string;
}

export function combination(input: CombinationInput): CalcResult {
  if (!input || !isNonNegativeInteger(input.n) || !isNonNegativeInteger(input.r)) {
    return { value: null, error: "Combination requires non-negative integer n and r." };
  }

  if (input.r > input.n) {
    return { value: null, error: "r cannot be greater than n." };
  }

  if (input.mode !== "nPr" && input.mode !== "nCr") {
    return { value: null, error: "Choose either nCr or nPr." };
  }

  const exact = input.mode === "nPr"
    ? permutationBigInt(input.n, input.r)
    : combinationBigInt(input.n, input.r);
  const value = bigIntToSafeNumber(exact);

  if (value === null) {
    return { value: null, error: "Count is too large to display safely." };
  }

  return {
    value,
    outputs: {
      count: value,
    },
  };
}
