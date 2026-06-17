import { describe, expect, it } from "vitest";
import { linearRegression } from "../linear-regression";

describe("linearRegression", () => {
  it("computes slope, intercept, r, and equation text", () => {
    const result = linearRegression({ x: [1, 2, 3, 4, 5], y: [2, 4, 5, 4, 5] });

    expect(result.value).toBeCloseTo(0.6);
    expect(result.outputs?.slope).toBeCloseTo(0.6);
    expect(result.outputs?.intercept).toBeCloseTo(2.2);
    expect(result.outputs?.r).toBeCloseTo(0.7746, 4);
    expect(result.outputs?.rSquared).toBeCloseTo(0.6);
    expect(result.outputs?.n).toBe(5);
    expect(result.text).toBe("y = 2.2 + 0.6x");
  });

  it("computes a perfect line", () => {
    const result = linearRegression({ x: [1, 2, 3, 4], y: [3, 5, 7, 9] });

    expect(result.value).toBeCloseTo(2);
    expect(result.outputs?.intercept).toBeCloseTo(1);
    expect(result.outputs?.r).toBeCloseTo(1);
  });

  it("rejects invalid paired lists and no x spread", () => {
    expect(linearRegression({ x: [1, 2], y: [1] }).value).toBeNull();
    expect(linearRegression({ x: [1], y: [2] }).value).toBeNull();
    expect(linearRegression({ x: [1, 1, 1], y: [2, 3, 4] }).value).toBeNull();
  });
});
