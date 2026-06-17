import { mean } from "./mean";
import { median } from "./median";
import { mode } from "./mode";
import { range } from "./range";
import type { CalcResult } from "./types";

export interface MmmrInput {
  values: number[];
}

export function mmmr(input: MmmrInput): CalcResult {
  const meanResult = mean(input);
  const medianResult = median(input);
  const modeResult = mode(input);
  const rangeResult = range(input);

  if (meanResult.value === null || medianResult.value === null || rangeResult.value === null) {
    return {
      value: null,
      error: "Mean, median, mode, and range require a non-empty array of finite numbers.",
    };
  }

  const outputs: Record<string, number> = {
    mean: meanResult.value,
    median: medianResult.value,
    range: rangeResult.value,
  };

  if (modeResult.value !== null) {
    outputs.mode = modeResult.value;
  }

  if (typeof modeResult.outputs?.count === "number") {
    outputs.modalFrequency = modeResult.outputs.count;
  }

  return {
    value: meanResult.value,
    outputs,
    text: modeResult.value === null ? modeResult.error : undefined,
  };
}
