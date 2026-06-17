import { describe, expect, it } from "vitest";
import { pairedRegressionSums } from "../_regression-core";

describe("pairedRegressionSums", () => {
  it("computes shared sums for paired x and y lists", () => {
    const result = pairedRegressionSums([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]);

    expect(result).not.toBeNull();
    expect(result?.n).toBe(5);
    expect(result?.sumX).toBe(15);
    expect(result?.sumY).toBe(20);
    expect(result?.sumXY).toBe(66);
    expect(result?.sumX2).toBe(55);
    expect(result?.sumY2).toBe(86);
    expect(result?.meanX).toBe(3);
    expect(result?.meanY).toBe(4);
    expect(result?.Sxx).toBe(10);
    expect(result?.Syy).toBe(6);
    expect(result?.Sxy).toBe(6);
  });

  it("rejects missing, unequal, too-short, or non-finite lists", () => {
    expect(pairedRegressionSums([1, 2], [1])).toBeNull();
    expect(pairedRegressionSums([1], [2])).toBeNull();
    expect(pairedRegressionSums([1, Number.NaN], [2, 3])).toBeNull();
    expect(pairedRegressionSums(undefined, [2, 3])).toBeNull();
  });
});
