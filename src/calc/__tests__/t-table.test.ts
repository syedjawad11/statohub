import { describe, expect, it } from "vitest";
import { tTable } from "../t-table";

describe("tTable", () => {
  it("looks up critical t values", () => {
    const result = tTable({ df: 10, level: "0.95", tails: "2" });

    expect(result.value).toBeCloseTo(2.228, 3);
    expect(result.outputs?.df).toBe(10);
    expect(result.outputs?.alpha).toBeCloseTo(0.05);
    expect(tTable({ df: 10, level: "0.95", tails: "1" }).value).toBeCloseTo(1.812, 3);
  });

  it("rejects invalid levels, tails, and df", () => {
    expect(tTable({ df: 0, level: "0.95", tails: "2" }).value).toBeNull();
    expect(tTable({ df: 10, level: "bad", tails: "2" }).value).toBeNull();
    expect(tTable({ df: 10, level: "0.95", tails: "bad" }).value).toBeNull();
  });
});
