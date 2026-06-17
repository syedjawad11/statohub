import {
  bigIntToSafeNumber,
  factorialBigInt,
  isNonNegativeInteger,
} from "./combinatorics-core";
import type { CalcResult } from "./types";

export interface FactorialInput {
  n: number;
}

export function factorial(input: FactorialInput): CalcResult {
  if (!input || !isNonNegativeInteger(input.n)) {
    return { value: null, error: "Factorial requires a non-negative integer n." };
  }

  const value = bigIntToSafeNumber(factorialBigInt(input.n));
  if (value === null) {
    return { value: null, error: "Factorial result is too large to display safely." };
  }

  return { value };
}
