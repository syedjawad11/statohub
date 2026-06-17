import { normalCdf } from "./_stats-math";
import type { CalcResult } from "./types";

export interface ZTableInput {
  z: number;
}

export function zTable(input: ZTableInput): CalcResult {
  const z = input?.z;

  if (typeof z !== "number" || !Number.isFinite(z)) {
    return { value: null, error: "z must be a finite number." };
  }

  const cumulative = normalCdf(z);
  return {
    value: cumulative,
    outputs: {
      cumulative,
      rightTail: 1 - cumulative,
      betweenZeroAndZ: cumulative - 0.5,
    },
  };
}
