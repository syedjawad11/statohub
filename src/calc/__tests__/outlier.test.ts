import { describe, expect, it } from "vitest";
import { outlier } from "../outlier";

describe("outlier", () => {
  it("returns Type 7 fences and the outlier list", () => {
    const result = outlier({ values: [2, 4, 4, 4, 5, 5, 7, 100] });

    expect(result.value).toBe(1);
    expect(result.outputs?.q1).toBeCloseTo(4);
    expect(result.outputs?.q3).toBeCloseTo(5.5);
    expect(result.outputs?.iqr).toBeCloseTo(1.5);
    expect(result.outputs?.lowerFence).toBeCloseTo(1.75);
    expect(result.outputs?.upperFence).toBeCloseTo(7.75);
    expect(result.list).toEqual([100]);
  });

  it("returns an empty list when no values are outliers", () => {
    const result = outlier({ values: [4, 4, 4] });

    expect(result.value).toBe(0);
    expect(result.list).toEqual([]);
  });

  it("returns an error for invalid input", () => {
    const result = outlier({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
