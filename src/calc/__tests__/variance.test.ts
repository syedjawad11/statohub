import { describe, expect, it } from "vitest";
import { variance } from "../variance";

describe("variance", () => {
  it("returns sample variance as the primary value and both variance outputs", () => {
    const result = variance({ values: [2, 4, 4, 4, 5, 5, 7, 9] });

    expect(result.value).toBeCloseTo(32 / 7);
    expect(result.outputs?.sample).toBeCloseTo(32 / 7);
    expect(result.outputs?.population).toBeCloseTo(4);
  });

  it("returns an error result for invalid input", () => {
    const result = variance({ values: [2, Number.NaN] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
