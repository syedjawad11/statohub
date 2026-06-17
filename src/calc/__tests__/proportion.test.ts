import { describe, expect, it } from "vitest";
import { proportion } from "../proportion";

describe("proportion", () => {
  it("solves the missing fourth proportional term", () => {
    const result = proportion({ a: 2, b: 3, c: 4 });

    expect(result.value).toBe(6);
    expect(result.outputs?.d).toBe(6);
    expect(result.outputs?.ratio).toBeCloseTo(2 / 3);
    expect(result.text).toBe("2 / 3 = 4 / 6");
  });

  it("rejects zero and non-finite inputs", () => {
    expect(proportion({ a: 0, b: 3, c: 4 }).value).toBeNull();
    expect(proportion({ a: Number.NaN, b: 3, c: 4 }).value).toBeNull();
  });
});
