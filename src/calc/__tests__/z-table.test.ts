import { describe, expect, it } from "vitest";
import { zTable } from "../z-table";

describe("zTable", () => {
  it("returns standard normal cumulative and tail values", () => {
    const result = zTable({ z: 0 });

    expect(result.value).toBeCloseTo(0.5);
    expect(result.outputs?.rightTail).toBeCloseTo(0.5);
    expect(result.outputs?.betweenZeroAndZ).toBeCloseTo(0);
  });

  it("rejects non-finite z values", () => {
    expect(zTable({ z: Number.NaN }).value).toBeNull();
  });
});
