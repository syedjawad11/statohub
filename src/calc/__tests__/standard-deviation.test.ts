import { describe, expect, it } from "vitest";
import { standardDeviation } from "../standard-deviation";

describe("standardDeviation", () => {
  it("returns sample standard deviation as the primary value and both outputs", () => {
    const result = standardDeviation({ values: [2, 4, 4, 4, 5, 5, 7, 9] });

    expect(result.value).toBeCloseTo(Math.sqrt(32 / 7));
    expect(result.outputs?.sample).toBeCloseTo(Math.sqrt(32 / 7));
    expect(result.outputs?.population).toBeCloseTo(2);
  });

  it("returns an error result for invalid input", () => {
    const result = standardDeviation({ values: [2] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
