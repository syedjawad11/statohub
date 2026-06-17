import { describe, expect, it } from "vitest";
import { confidenceInterval } from "../confidence-interval";

describe("confidenceInterval", () => {
  it("computes a z-based confidence interval for a mean", () => {
    const result = confidenceInterval({ mean: 100, sd: 15, n: 100, level: "0.95" });

    expect(result.value).toBeCloseTo(2.94, 2);
    expect(result.outputs?.lower).toBeCloseTo(97.06, 2);
    expect(result.outputs?.upper).toBeCloseTo(102.94, 2);
    expect(result.outputs?.standardError).toBeCloseTo(1.5);
    expect(result.outputs?.z).toBeCloseTo(1.95996, 5);
  });

  it("rejects invalid inputs cleanly", () => {
    expect(confidenceInterval({ mean: 100, sd: -1, n: 100, level: "0.95" }).value).toBeNull();
    expect(confidenceInterval({ mean: 100, sd: 15, n: 1.5, level: "0.95" }).value).toBeNull();
    expect(confidenceInterval({ mean: 100, sd: 15, n: 100, level: "1" }).value).toBeNull();
  });
});
