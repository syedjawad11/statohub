import type { CalcResult } from "./types";

export interface ProportionInput {
  a: number;
  b: number;
  c: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function proportion(input: ProportionInput): CalcResult {
  if (!isFiniteNumber(input?.a) || !isFiniteNumber(input.b) || !isFiniteNumber(input.c)) {
    return { value: null, error: "a, b, and c must be finite numbers." };
  }

  if (input.a === 0 || input.b === 0 || input.c === 0) {
    return { value: null, error: "a, b, and c must be nonzero so the proportion ratio is defined." };
  }

  const d = (input.b * input.c) / input.a;
  const ratio = input.c / d;

  return {
    value: d,
    outputs: {
      d,
      ratio,
    },
    text: `${input.a} / ${input.b} = ${input.c} / ${d}`,
  };
}
