import { describe, expect, it } from "vitest";
import { combination } from "../combination";

describe("combination", () => {
  it("returns 10C3 as 120", () => {
    expect(combination({ n: 10, r: 3, mode: "nCr" }).value).toBe(120);
  });

  it("returns 10P3 as 720", () => {
    expect(combination({ n: 10, r: 3, mode: "nPr" }).value).toBe(720);
  });

  it("rejects invalid values and unsafe counts", () => {
    expect(combination({ n: 3, r: 4, mode: "nCr" }).value).toBeNull();
    expect(combination({ n: -1, r: 1, mode: "nCr" }).value).toBeNull();
    expect(combination({ n: 100, r: 50, mode: "nCr" }).value).toBeNull();
  });
});
