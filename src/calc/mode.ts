import type { CalcResult } from "./types";

export interface ModeInput {
  values: number[];
}

function getValidValues(input: ModeInput): number[] | null {
  if (!input || !Array.isArray(input.values) || input.values.length === 0) {
    return null;
  }

  return input.values.every((value) => Number.isFinite(value)) ? input.values : null;
}

export function mode(input: ModeInput): CalcResult {
  const values = getValidValues(input);

  if (!values) {
    return { value: null, error: "Mode requires a non-empty array of finite numbers." };
  }

  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let modalValue = Number.POSITIVE_INFINITY;
  let modalCount = 0;

  for (const [value, count] of counts) {
    if (count > modalCount || (count === modalCount && value < modalValue)) {
      modalValue = value;
      modalCount = count;
    }
  }

  if (modalCount <= 1) {
    return { value: null, outputs: { count: modalCount }, error: "No mode: every value appears once." };
  }

  // Multimodal ties are deterministic: return the lowest tied mode.
  return { value: modalValue, outputs: { count: modalCount } };
}
