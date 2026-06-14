import { describe, expect, it } from "vitest";
import { range } from "../range";

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe("range", () => {
  it("returns the range with min and max", () => {
    const result = range({ values });

    expect(result.value).toBe(7);
    expect(result.outputs).toEqual({ range: 7, min: 2, max: 9 });
  });

  it("returns an error for invalid input", () => {
    const result = range({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
