import { describe, expect, it } from "vitest";
import { rangeIqr } from "../range-iqr";

describe("rangeIqr", () => {
  it("returns min, max, range, Type 7 quartiles, and IQR", () => {
    const result = rangeIqr({ values: [2, 4, 4, 4, 5, 5, 7, 9] });

    expect(result.value).toBeCloseTo(1.5);
    expect(result.outputs?.min).toBe(2);
    expect(result.outputs?.max).toBe(9);
    expect(result.outputs?.range).toBe(7);
    expect(result.outputs?.q1).toBeCloseTo(4);
    expect(result.outputs?.q2).toBeCloseTo(4.5);
    expect(result.outputs?.q3).toBeCloseTo(5.5);
    expect(result.outputs?.iqr).toBeCloseTo(1.5);
  });

  it("handles a single identical value", () => {
    const result = rangeIqr({ values: [4] });

    expect(result.value).toBe(0);
    expect(result.outputs).toEqual({ min: 4, max: 4, range: 0, q1: 4, q2: 4, q3: 4, iqr: 0 });
  });

  it("returns an error for invalid input", () => {
    const result = rangeIqr({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
