import { describe, expect, it } from "vitest";
import { chiSquare } from "../chi-square";

describe("chiSquare", () => {
  it("computes goodness-of-fit statistic and p-value", () => {
    const result = chiSquare({ observed: [20, 30], expected: [25, 25] });

    expect(result.value).toBeCloseTo(2);
    expect(result.outputs?.statistic).toBeCloseTo(2);
    expect(result.outputs?.df).toBe(1);
    expect(result.outputs?.pValue).toBeCloseTo(0.1573, 4);
  });

  it("rejects invalid paired lists", () => {
    expect(chiSquare({ observed: [1], expected: [1] }).value).toBeNull();
    expect(chiSquare({ observed: [1, 2], expected: [1] }).value).toBeNull();
    expect(chiSquare({ observed: [1, 2], expected: [1, 0] }).value).toBeNull();
  });
});
