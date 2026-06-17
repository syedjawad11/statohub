import { describe, expect, it } from "vitest";
import { frequencyTable } from "../frequency-table";

describe("frequencyTable", () => {
  it("returns sorted frequency rows with relative and cumulative frequency", () => {
    const result = frequencyTable({ values: [2, 4, 4, 4, 5, 5, 7, 9] });

    expect(result.value).toBe(8);
    expect(result.outputs?.total).toBe(8);
    expect(result.table?.columns).toEqual([
      "Value",
      "Frequency",
      "Relative Frequency",
      "Cumulative Frequency",
    ]);
    expect(result.table?.rows).toEqual([
      [2, 1, 0.125, 1],
      [4, 3, 0.375, 4],
      [5, 2, 0.25, 6],
      [7, 1, 0.125, 7],
      [9, 1, 0.125, 8],
    ]);
  });

  it("handles all-identical values", () => {
    const result = frequencyTable({ values: [4, 4, 4] });

    expect(result.value).toBe(3);
    expect(result.table?.rows).toEqual([[4, 3, 1, 3]]);
  });

  it("returns an error for invalid input", () => {
    const result = frequencyTable({ values: [] });

    expect(result.value).toBeNull();
    expect(result.error).toEqual(expect.any(String));
  });
});
