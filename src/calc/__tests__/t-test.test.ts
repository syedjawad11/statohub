import { describe, expect, it } from "vitest";
import { tTest } from "../t-test";

describe("tTest", () => {
  it("computes a one-sample t-test", () => {
    const result = tTest({ sampleMean: 105, populationMean: 100, sampleSd: 15, n: 25 });

    expect(result.value).toBeCloseTo(1.667, 3);
    expect(result.outputs?.t).toBeCloseTo(1.667, 3);
    expect(result.outputs?.df).toBe(24);
    expect(result.outputs?.standardError).toBeCloseTo(3);
    expect(result.outputs?.pValue).toBeCloseTo(0.1086, 3);
  });

  it("rejects invalid sample sizes and standard deviations", () => {
    expect(tTest({ sampleMean: 1, populationMean: 0, sampleSd: 0, n: 10 }).value).toBeNull();
    expect(tTest({ sampleMean: 1, populationMean: 0, sampleSd: 1, n: 1 }).value).toBeNull();
    expect(tTest({ sampleMean: 1, populationMean: 0, sampleSd: 1, n: 2.5 }).value).toBeNull();
  });
});
