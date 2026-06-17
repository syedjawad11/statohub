import { describe, expect, it } from "vitest";
import { mmmr } from "../mmmr";

describe("mmmr", () => {
  it("returns mean, median, mode, modal frequency, and range", () => {
    const result = mmmr({ values: [2, 4, 4, 4, 5, 5, 7, 9] });

    expect(result.value).toBeCloseTo(5);
    expect(result.outputs).toEqual({
      mean: 5,
      median: 4.5,
      range: 7,
      mode: 4,
      modalFrequency: 3,
    });
  });

  it("keeps no-mode datasets valid and explains the missing mode", () => {
    const result = mmmr({ values: [1, 2, 3] });

    expect(result.value).toBe(2);
    expect(result.outputs?.mean).toBe(2);
    expect(result.outputs?.median).toBe(2);
    expect(result.outputs?.range).toBe(2);
    expect(result.outputs?.modalFrequency).toBe(1);
    expect(result.text).toEqual(expect.any(String));
  });

  it("returns an error for invalid input", () => {
    const result = mmmr({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
