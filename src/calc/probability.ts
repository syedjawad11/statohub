import type { CalcResult } from "./types";

export interface ProbabilityInput {
  favorable: number;
  total: number;
}

export function probability(input: ProbabilityInput): CalcResult {
  if (!input || !Number.isFinite(input.favorable) || !Number.isFinite(input.total)) {
    return { value: null, error: "Probability requires finite favorable and total outcomes." };
  }

  if (input.total <= 0) {
    return { value: null, error: "Total outcomes must be greater than 0." };
  }

  if (input.favorable < 0 || input.favorable > input.total) {
    return { value: null, error: "Favorable outcomes must be between 0 and total outcomes." };
  }

  const value = input.favorable / input.total;

  return {
    value,
    outputs: {
      probability: value,
      complement: 1 - value,
    },
  };
}
