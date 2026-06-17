import { combinationNumber, isNonNegativeInteger } from "./combinatorics-core";
import type { CalcResult } from "./types";

export interface BinomialInput {
  n: number;
  p: number;
  k: number;
  mode: string;
}

function probabilityMass(n: number, p: number, k: number): number | null {
  const count = combinationNumber(n, k);
  if (count === null) {
    return null;
  }

  return count * p ** k * (1 - p) ** (n - k);
}

export function binomial(input: BinomialInput): CalcResult {
  if (!input || !isNonNegativeInteger(input.n) || !isNonNegativeInteger(input.k)) {
    return { value: null, error: "Binomial probability requires non-negative integer n and k." };
  }

  if (!Number.isFinite(input.p) || input.p < 0 || input.p > 1) {
    return { value: null, error: "Success probability p must be between 0 and 1." };
  }

  if (input.k > input.n) {
    return { value: null, error: "k cannot be greater than n." };
  }

  if (input.mode !== "exactly" && input.mode !== "atMost" && input.mode !== "atLeast") {
    return { value: null, error: "Choose exactly, at most, or at least." };
  }

  let value = 0;
  const start = input.mode === "exactly" || input.mode === "atLeast" ? input.k : 0;
  const end = input.mode === "exactly" || input.mode === "atMost" ? input.k : input.n;

  for (let successes = start; successes <= end; successes += 1) {
    const term = probabilityMass(input.n, input.p, successes);
    if (term === null || !Number.isFinite(term)) {
      return { value: null, error: "Binomial count is too large to display safely." };
    }
    value += term;
  }

  return {
    value,
    outputs: {
      probability: value,
    },
  };
}
