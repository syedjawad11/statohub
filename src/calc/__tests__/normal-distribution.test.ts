import { describe, expect, it } from "vitest";
import { normalDistribution } from "../normal-distribution";

describe("normalDistribution", () => {
  it("computes less-than, greater-than, and between probabilities", () => {
    expect(normalDistribution({ mean: 0, sd: 1, x: 1.96, upper: 2, mode: "lessThan" }).value).toBeCloseTo(0.975, 4);
    expect(normalDistribution({ mean: 0, sd: 1, x: 1.96, upper: 2, mode: "greaterThan" }).value).toBeCloseTo(0.025, 4);

    const between = normalDistribution({ mean: 0, sd: 1, x: -1, upper: 1, mode: "between" });
    expect(between.value).toBeCloseTo(0.6827, 4);
    expect(between.outputs?.zLower).toBeCloseTo(-1);
    expect(between.outputs?.zUpper).toBeCloseTo(1);
  });

  it("rejects invalid standard deviations and between bounds", () => {
    expect(normalDistribution({ mean: 0, sd: 0, x: 1, upper: 2, mode: "lessThan" }).value).toBeNull();
    expect(normalDistribution({ mean: 0, sd: 1, x: 2, upper: 1, mode: "between" }).value).toBeNull();
    expect(normalDistribution({ mean: 0, sd: 1, x: 1, upper: 2, mode: "bad" }).value).toBeNull();
  });
});
