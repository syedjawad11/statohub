import type { CalcResult } from "./types";

export interface FrequencyTableInput {
  values: number[];
}

export function frequencyTable(input: FrequencyTableInput): CalcResult {
  if (
    !input ||
    !Array.isArray(input.values) ||
    input.values.length === 0 ||
    !input.values.every(Number.isFinite)
  ) {
    return { value: null, error: "Frequency table requires a non-empty array of finite numbers." };
  }

  const counts = new Map<number, number>();
  for (const value of input.values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const rows: (string | number)[][] = [];
  let cumulative = 0;
  const total = input.values.length;

  for (const value of [...counts.keys()].sort((a, b) => a - b)) {
    const frequency = counts.get(value) ?? 0;
    cumulative += frequency;
    rows.push([value, frequency, frequency / total, cumulative]);
  }

  return {
    value: total,
    outputs: { total },
    table: {
      columns: ["Value", "Frequency", "Relative Frequency", "Cumulative Frequency"],
      rows,
    },
  };
}
