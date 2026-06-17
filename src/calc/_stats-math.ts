const sqrtTwo = Math.SQRT2;
const invSqrtTwoPi = 1 / Math.sqrt(2 * Math.PI);
const epsilon = 1e-14;
const tiny = 1e-300;
const maxIterations = 200;

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function erf(x: number): number {
  if (!Number.isFinite(x)) {
    return Number.isNaN(x) ? Number.NaN : Math.sign(x);
  }

  // Abramowitz and Stegun 7.1.26 approximation for the error function.
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * absX);
  const polynomial =
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;

  return sign * (1 - polynomial * Math.exp(-absX * absX));
}

export function normalCdf(x: number, mean = 0, sd = 1): number {
  if (!Number.isFinite(x) || !Number.isFinite(mean) || !isPositiveFinite(sd)) {
    return Number.NaN;
  }

  return 0.5 * (1 + erf((x - mean) / (sd * sqrtTwo)));
}

export function normalPdf(x: number, mean = 0, sd = 1): number {
  if (!Number.isFinite(x) || !Number.isFinite(mean) || !isPositiveFinite(sd)) {
    return Number.NaN;
  }

  const z = (x - mean) / sd;
  return (invSqrtTwoPi / sd) * Math.exp(-0.5 * z * z);
}

export function inverseNormalCdf(p: number, mean = 0, sd = 1): number {
  if (!Number.isFinite(p) || p <= 0 || p >= 1 || !Number.isFinite(mean) || !isPositiveFinite(sd)) {
    return Number.NaN;
  }

  // Peter J. Acklam's inverse normal CDF rational approximation.
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];
  const low = 0.02425;
  const high = 1 - low;

  let z: number;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= high) {
    const q = p - 0.5;
    const r = q * q;
    z = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
      / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  return mean + sd * z;
}

export function zCritical(confidenceLevel: number): number {
  if (!Number.isFinite(confidenceLevel) || confidenceLevel <= 0 || confidenceLevel >= 1) {
    return Number.NaN;
  }

  return inverseNormalCdf(1 - (1 - confidenceLevel) / 2);
}

export function logGamma(x: number): number {
  if (!isPositiveFinite(x)) {
    return Number.NaN;
  }

  // Lanczos approximation, coefficients from Numerical Recipes.
  const coefficients = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953,
  ];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let series = 1.000000000190015;

  for (const coefficient of coefficients) {
    y += 1;
    series += coefficient / y;
  }

  return -tmp + Math.log(2.5066282746310005 * series / x);
}

export function lowerRegularizedGamma(s: number, x: number): number {
  if (!isPositiveFinite(s) || !Number.isFinite(x)) {
    return Number.NaN;
  }
  if (x <= 0) {
    return 0;
  }

  const gln = logGamma(s);
  if (x < s + 1) {
    let sum = 1 / s;
    let term = sum;

    for (let n = 1; n <= maxIterations; n += 1) {
      term *= x / (s + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * epsilon) {
        return Math.min(1, Math.max(0, sum * Math.exp(-x + s * Math.log(x) - gln)));
      }
    }

    return Math.min(1, Math.max(0, sum * Math.exp(-x + s * Math.log(x) - gln)));
  }

  let b = x + 1 - s;
  let c = 1 / tiny;
  let d = 1 / Math.max(b, tiny);
  let h = d;

  for (let i = 1; i <= maxIterations; i += 1) {
    const an = -i * (i - s);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) {
      d = tiny;
    }
    c = b + an / c;
    if (Math.abs(c) < tiny) {
      c = tiny;
    }
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < epsilon) {
      const q = Math.exp(-x + s * Math.log(x) - gln) * h;
      return Math.min(1, Math.max(0, 1 - q));
    }
  }

  const q = Math.exp(-x + s * Math.log(x) - gln) * h;
  return Math.min(1, Math.max(0, 1 - q));
}

export function chiSquareCdf(x: number, df: number): number {
  if (!Number.isFinite(x) || !isPositiveFinite(df)) {
    return Number.NaN;
  }
  if (x <= 0) {
    return 0;
  }

  return lowerRegularizedGamma(df / 2, x / 2);
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < tiny) {
    d = tiny;
  }
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) {
      d = tiny;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) {
      c = tiny;
    }
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) {
      d = tiny;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) {
      c = tiny;
    }
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < epsilon) {
      break;
    }
  }

  return h;
}

export function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (!Number.isFinite(x) || !isPositiveFinite(a) || !isPositiveFinite(b) || x < 0 || x > 1) {
    return Number.NaN;
  }
  if (x === 0 || x === 1) {
    return x;
  }

  const front = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );

  if (x < (a + 1) / (a + b + 2)) {
    return Math.min(1, Math.max(0, (front * betaContinuedFraction(x, a, b)) / a));
  }

  return Math.min(1, Math.max(0, 1 - (front * betaContinuedFraction(1 - x, b, a)) / b));
}

export function studentTCdf(t: number, df: number): number {
  if (!Number.isFinite(t) || !isPositiveFinite(df)) {
    return Number.NaN;
  }
  if (t === 0) {
    return 0.5;
  }

  const x = df / (df + t * t);
  const ibeta = regularizedIncompleteBeta(x, df / 2, 0.5);
  return t > 0 ? 1 - 0.5 * ibeta : 0.5 * ibeta;
}

export function inverseStudentTCdf(p: number, df: number): number {
  if (!Number.isFinite(p) || p <= 0 || p >= 1 || !isPositiveFinite(df)) {
    return Number.NaN;
  }

  let low = -1;
  let high = 1;
  while (studentTCdf(low, df) > p) {
    low *= 2;
  }
  while (studentTCdf(high, df) < p) {
    high *= 2;
  }

  for (let i = 0; i < 100; i += 1) {
    const mid = (low + high) / 2;
    if (studentTCdf(mid, df) < p) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

export function tCritical(confidenceLevel: number, df: number, tails: 1 | 2): number {
  if (!Number.isFinite(confidenceLevel) || confidenceLevel <= 0 || confidenceLevel >= 1 || !isPositiveFinite(df)) {
    return Number.NaN;
  }

  if (tails === 1) {
    return inverseStudentTCdf(confidenceLevel, df);
  }
  if (tails === 2) {
    return inverseStudentTCdf(1 - (1 - confidenceLevel) / 2, df);
  }

  return Number.NaN;
}
