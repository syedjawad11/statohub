import { describe, expect, it } from "vitest";
import { pValue } from "../p-value";

describe("pValue", () => {
  it("computes z-distribution p-values for different tails", () => {
    expect(pValue({ statistic: 1.96, distribution: "z", tail: "two" }).value).toBeCloseTo(0.05, 2);
    expect(pValue({ statistic: 1.645, distribution: "z", tail: "right" }).value).toBeCloseTo(0.05, 2);
    expect(pValue({ statistic: -1.645, distribution: "z", tail: "left" }).value).toBeCloseTo(0.05, 2);
  });

  it("computes Student-t p-values and validates df", () => {
    const result = pValue({ statistic: 2.228, df: 10, distribution: "t", tail: "two" });
    expect(result.value).toBeCloseTo(0.05, 2);
    expect(result.outputs?.df).toBe(10);
    expect(pValue({ statistic: 2, df: 0, distribution: "t", tail: "right" }).value).toBeNull();
  });
});
