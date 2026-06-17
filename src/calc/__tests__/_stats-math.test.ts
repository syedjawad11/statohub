import { describe, expect, it } from "vitest";
import {
  chiSquareCdf,
  inverseNormalCdf,
  normalCdf,
  normalPdf,
  studentTCdf,
  tCritical,
  zCritical,
} from "../_stats-math";

describe("stats math helpers", () => {
  it("computes standard normal probabilities", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 4);
    expect(normalCdf(-1)).toBeCloseTo(0.1587, 4);
    expect(normalPdf(0)).toBeCloseTo(0.39894228);
  });

  it("computes inverse normal probabilities and critical values", () => {
    expect(inverseNormalCdf(0.975)).toBeCloseTo(1.95996, 5);
    expect(zCritical(0.95)).toBeCloseTo(1.95996, 5);
    expect(zCritical(0.99)).toBeCloseTo(2.57583, 5);
  });

  it("round-trips CDF and inverse CDF values", () => {
    expect(inverseNormalCdf(normalCdf(0.7))).toBeCloseTo(0.7, 5);
  });

  it("rejects impossible inverse probability inputs", () => {
    expect(inverseNormalCdf(0)).toBeNaN();
    expect(inverseNormalCdf(1)).toBeNaN();
    expect(zCritical(1)).toBeNaN();
  });

  it("computes chi-square probabilities", () => {
    expect(chiSquareCdf(3.84146, 1)).toBeCloseTo(0.95, 3);
    expect(chiSquareCdf(2, 1)).toBeCloseTo(0.8427, 4);
  });

  it("computes Student-t probabilities and critical values", () => {
    expect(studentTCdf(0, 10)).toBeCloseTo(0.5);
    expect(tCritical(0.95, 10, 2)).toBeCloseTo(2.228, 3);
    expect(tCritical(0.95, 1, 2)).toBeCloseTo(12.706, 3);
    expect(tCritical(0.95, 100000, 2)).toBeCloseTo(1.96, 2);
  });
});
