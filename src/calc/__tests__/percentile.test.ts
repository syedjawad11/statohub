import { describe, expect, it } from "vitest";
import { percentile } from "../percentile";

describe("percentile", () => {
  it("uses Type 7 interpolation for percentiles and quartiles", () => {
    const result = percentile({ values: [2, 4, 4, 4, 5, 5, 7, 9], p: 90 });

    expect(result.value).toBeCloseTo(7.6);
    expect(result.outputs?.q1).toBeCloseTo(4);
    expect(result.outputs?.q2).toBeCloseTo(4.5);
    expect(result.outputs?.q3).toBeCloseTo(5.5);
    expect(result.outputs?.iqr).toBeCloseTo(1.5);
  });

  it("returns the median for p=50", () => {
    const result = percentile({ values: [2, 4, 4, 4, 5, 5, 7, 9], p: 50 });

    expect(result.value).toBeCloseTo(4.5);
  });

  it("returns an error result for invalid input", () => {
    const result = percentile({ values: [2, 4], p: 101 });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
