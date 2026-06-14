import { describe, expect, it } from "vitest";
import { meanAbsoluteDeviation } from "../mean-absolute-deviation";

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe("meanAbsoluteDeviation", () => {
  it("returns the mean absolute deviation about the mean", () => {
    expect(meanAbsoluteDeviation({ values }).value).toBe(1.5);
  });

  it("returns an error for invalid input", () => {
    const result = meanAbsoluteDeviation({ values: [1, Number.NaN] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
