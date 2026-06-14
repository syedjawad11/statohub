const defaultPrecision = 4;

const tokenPattern = /[,\s]+/;

function normalizePrecision(precision: number): number {
  if (!Number.isFinite(precision)) {
    return defaultPrecision;
  }

  return Math.max(0, Math.min(20, Math.trunc(precision)));
}

export function parseNumberList(rawValue: string): number[] {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === "") {
    return [];
  }

  return trimmedValue.split(tokenPattern).map((token) => Number(token));
}

export function parseNumber(rawValue: string): number {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === "") {
    return Number.NaN;
  }

  return Number(trimmedValue);
}

export function formatNumber(value: number, precision = defaultPrecision): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const decimalPlaces = normalizePrecision(precision);
  const factor = 10 ** decimalPlaces;
  const sign = value < 0 ? -1 : 1;
  const rounded = (Math.round((Math.abs(value) + Number.EPSILON) * factor) / factor) * sign;

  if (Object.is(rounded, -0)) {
    return "0";
  }

  const formatted = rounded.toFixed(decimalPlaces).replace(/(?:\.0+|(\.\d*?)0+)$/, "$1");

  if (formatted === "0" && value !== 0 && decimalPlaces > 0) {
    return value.toPrecision(decimalPlaces).replace(/(?:\.0+|(\.\d*?)0+)(e|$)/, "$1$2");
  }

  return formatted;
}
