import { describe, expect, it } from "vitest";
import { formatNumber, parseNumber, parseNumberList } from "./format";

describe("statcalc format helpers", () => {
  describe("parseNumberList", () => {
    it("splits values on commas, whitespace, and newlines", () => {
      expect(parseNumberList("2, 4  4\n4\r\n5\t5,7, 9")).toEqual([2, 4, 4, 4, 5, 5, 7, 9]);
    });

    it("returns an empty array for blank input", () => {
      expect(parseNumberList(" \n\t ")).toEqual([]);
    });

    it("uses Number conversion for each token", () => {
      const result = parseNumberList("1 nope 3");

      expect(result[0]).toBe(1);
      expect(Number.isNaN(result[1])).toBe(true);
      expect(result[2]).toBe(3);
    });
  });

  describe("parseNumber", () => {
    it("converts a numeric string to a number", () => {
      expect(parseNumber(" 2.5 ")).toBe(2.5);
    });

    it("returns NaN for blank input", () => {
      expect(Number.isNaN(parseNumber(""))).toBe(true);
    });
  });

  describe("formatNumber", () => {
    it("rounds numbers to the requested display precision", () => {
      expect(formatNumber(2.138089935, 4)).toBe("2.1381");
      expect(formatNumber(2.138089935, 2)).toBe("2.14");
      expect(formatNumber(-1.005, 2)).toBe("-1.01");
    });

    it("trims unnecessary trailing zeroes", () => {
      expect(formatNumber(2, 4)).toBe("2");
      expect(formatNumber(2.5, 4)).toBe("2.5");
    });

    it("preserves visible precision for small nonzero values", () => {
      expect(formatNumber(0.00001234, 4)).toBe("0.00001234");
    });

    it("normalizes negative zero for display", () => {
      expect(formatNumber(-0.00001, 4)).toBe("0");
    });
  });
});
