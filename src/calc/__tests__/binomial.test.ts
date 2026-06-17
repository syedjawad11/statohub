import { describe, expect, it } from "vitest";
import { binomial } from "../binomial";

describe("binomial", () => {
  it("returns exact binomial probability for n=10, p=0.5, k=5", () => {
    const result = binomial({ n: 10, p: 0.5, k: 5, mode: "exactly" });

    expect(result.value).toBeCloseTo(0.24609375);
  });

  it("returns cumulative at-most and at-least probabilities", () => {
    expect(binomial({ n: 10, p: 0.5, k: 5, mode: "atMost" }).value).toBeCloseTo(0.623046875);
    expect(binomial({ n: 10, p: 0.5, k: 5, mode: "atLeast" }).value).toBeCloseTo(0.623046875);
  });

  it("rejects invalid values and unsafe counts", () => {
    expect(binomial({ n: 10, p: 1.5, k: 5, mode: "exactly" }).value).toBeNull();
    expect(binomial({ n: 10, p: 0.5, k: 11, mode: "exactly" }).value).toBeNull();
    expect(binomial({ n: 100, p: 0.5, k: 50, mode: "exactly" }).value).toBeNull();
  });
});
