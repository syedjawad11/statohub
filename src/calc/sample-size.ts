import { zCritical } from "./_stats-math";
import type { CalcResult } from "./types";

export interface SampleSizeInput {
  level: string;
  margin: number;
  p: number;
}

export function sampleSize(input: SampleSizeInput): CalcResult {
  const level = Number(input?.level);
  const margin = input?.margin;
  const p = input?.p;

  if (!Number.isFinite(level) || typeof margin !== "number" || typeof p !== "number" || !Number.isFinite(margin) || !Number.isFinite(p)) {
    return { value: null, error: "Confidence level, margin of error, and proportion must be valid." };
  }

  if (margin <= 0) {
    return { value: null, error: "Margin of error must be greater than zero." };
  }

  if (p < 0 || p > 1) {
    return { value: null, error: "Estimated proportion must be between 0 and 1." };
  }

  const z = zCritical(level);
  if (!Number.isFinite(z)) {
    return { value: null, error: "Confidence level must be between 0 and 1." };
  }

  const nRaw = (z * z * p * (1 - p)) / (margin * margin);
  const requiredN = Math.ceil(nRaw);

  return {
    value: requiredN,
    outputs: {
      requiredN,
      nRaw,
      z,
    },
  };
}
