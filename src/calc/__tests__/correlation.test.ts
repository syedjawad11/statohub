import { describe, expect, it } from "vitest";
import { correlation } from "../correlation";

describe("correlation", () => {
  it("computes Pearson r and r-squared", () => {
    const result = correlation({ x: [1, 2, 3, 4, 5], y: [2, 4, 5, 4, 5] });

    expect(result.value).toBeCloseTo(0.7746, 4);
    expect(result.outputs?.rSquared).toBeCloseTo(0.6);
    expect(result.outputs?.n).toBe(5);
  });

  it("returns r = 1 for a perfect positive line", () => {
    const result = correlation({ x: [1, 2, 3, 4], y: [3, 5, 7, 9] });

    expect(result.value).toBeCloseTo(1);
  });

  it("rejects invalid paired lists and zero-variance data", () => {
    expect(correlation({ x: [1, 2], y: [1] }).value).toBeNull();
    expect(correlation({ x: [1], y: [2] }).value).toBeNull();
    expect(correlation({ x: [1, 1, 1], y: [2, 3, 4] }).value).toBeNull();
  });
});
