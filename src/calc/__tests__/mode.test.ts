import { describe, expect, it } from "vitest";
import { mode } from "../mode";

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe("mode", () => {
  it("returns the mode and modal frequency", () => {
    const result = mode({ values });

    expect(result.value).toBe(4);
    expect(result.outputs?.count).toBe(3);
  });

  it("returns the lowest mode for multimodal ties", () => {
    const result = mode({ values: [8, 3, 8, 3, 5] });

    expect(result.value).toBe(3);
    expect(result.outputs?.count).toBe(2);
  });

  it("returns an error when there is no repeated value", () => {
    const result = mode({ values: [1, 2, 3] });

    expect(result.value).toBeNull();
    expect(result.outputs?.count).toBe(1);
    expect(result.error).toEqual(expect.any(String));
  });

  it("returns an error for invalid input", () => {
    const result = mode({ values: [1, Number.POSITIVE_INFINITY] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
