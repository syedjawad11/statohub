import { tCritical } from "./_stats-math";
import type { CalcResult } from "./types";

export interface TTableInput {
  df: number;
  level: string;
  tails: string;
}

export function tTable(input: TTableInput): CalcResult {
  if (!input || typeof input.df !== "number" || !Number.isFinite(input.df) || !Number.isInteger(input.df) || input.df < 1) {
    return { value: null, error: "Degrees of freedom must be an integer of at least 1." };
  }

  const level = Number(input.level);
  if (!Number.isFinite(level) || level <= 0 || level >= 1) {
    return { value: null, error: "Choose a valid confidence level." };
  }

  if (input.tails !== "1" && input.tails !== "2") {
    return { value: null, error: "Choose one-tailed or two-tailed." };
  }

  const tails = input.tails === "1" ? 1 : 2;
  const criticalT = tCritical(level, input.df, tails);

  return {
    value: criticalT,
    outputs: {
      df: input.df,
      alpha: 1 - level,
    },
  };
}
