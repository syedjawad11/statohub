import { describe, expect, it } from "vitest";
import { mean } from "../mean";

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe("mean", () => {
  it("returns the arithmetic mean", () => {
    expect(mean({ values }).value).toBe(5);
  });

  it("returns an error for invalid input", () => {
    const result = mean({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
