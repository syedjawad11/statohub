const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);

export function isNonNegativeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

export function bigIntToSafeNumber(value: bigint): number | null {
  if (value > maxSafeBigInt) {
    return null;
  }

  return Number(value);
}

export function factorialBigInt(n: number): bigint {
  let result = 1n;

  for (let factor = 2n; factor <= BigInt(n); factor += 1n) {
    result *= factor;
  }

  return result;
}

export function permutationBigInt(n: number, r: number): bigint {
  let result = 1n;

  for (let offset = 0; offset < r; offset += 1) {
    result *= BigInt(n - offset);
  }

  return result;
}

export function combinationBigInt(n: number, r: number): bigint {
  const k = Math.min(r, n - r);
  let numerator = 1n;
  let denominator = 1n;

  for (let index = 1; index <= k; index += 1) {
    numerator *= BigInt(n - k + index);
    denominator *= BigInt(index);
  }

  return numerator / denominator;
}

export function combinationNumber(n: number, r: number): number | null {
  return bigIntToSafeNumber(combinationBigInt(n, r));
}
