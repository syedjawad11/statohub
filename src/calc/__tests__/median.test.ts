import { describe, expect, it } from "vitest";
import { median } from "../median";

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe("median", () => {
  it("returns the median", () => {
    expect(median({ values }).value).toBe(4.5);
  });

  it("returns an error for invalid input", () => {
    const result = median({ values: [1, Number.NaN] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
