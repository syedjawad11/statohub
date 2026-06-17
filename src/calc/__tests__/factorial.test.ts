import { describe, expect, it } from "vitest";
import { factorial } from "../factorial";

describe("factorial", () => {
  it("returns 5! as 120", () => {
    expect(factorial({ n: 5 }).value).toBe(120);
  });

  it("returns 0! as 1", () => {
    expect(factorial({ n: 0 }).value).toBe(1);
  });

  it("rejects invalid or unsafe inputs", () => {
    expect(factorial({ n: -1 }).value).toBeNull();
    expect(factorial({ n: 1.5 }).value).toBeNull();
    expect(factorial({ n: 19 }).value).toBeNull();
  });
});
