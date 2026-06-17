import { describe, expect, it } from "vitest";
import { probability } from "../probability";

describe("probability", () => {
  it("returns probability and complement", () => {
    const result = probability({ favorable: 3, total: 10 });

    expect(result.value).toBe(0.3);
    expect(result.outputs?.probability).toBe(0.3);
    expect(result.outputs?.complement).toBe(0.7);
  });

  it("allows certain and impossible events", () => {
    expect(probability({ favorable: 0, total: 10 }).value).toBe(0);
    expect(probability({ favorable: 10, total: 10 }).value).toBe(1);
  });

  it("rejects invalid outcomes", () => {
    expect(probability({ favorable: 2, total: 0 }).value).toBeNull();
    expect(probability({ favorable: 11, total: 10 }).value).toBeNull();
    expect(probability({ favorable: -1, total: 10 }).value).toBeNull();
  });
});
