import { describe, expect, it } from "vitest";
import { sampleSize } from "../sample-size";

describe("sampleSize", () => {
  it("computes sample size for a population proportion", () => {
    const result = sampleSize({ level: "0.95", margin: 0.05, p: 0.5 });

    expect(result.value).toBe(385);
    expect(result.outputs?.nRaw).toBeCloseTo(384.1459, 4);
    expect(result.outputs?.z).toBeCloseTo(1.95996, 5);
  });

  it("rejects invalid margins, proportions, and levels", () => {
    expect(sampleSize({ level: "0.95", margin: 0, p: 0.5 }).value).toBeNull();
    expect(sampleSize({ level: "0.95", margin: 0.05, p: 1.5 }).value).toBeNull();
    expect(sampleSize({ level: "1", margin: 0.05, p: 0.5 }).value).toBeNull();
  });
});
