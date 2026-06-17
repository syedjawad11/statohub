export interface RegressionSums {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
  meanX: number;
  meanY: number;
  Sxx: number;
  Syy: number;
  Sxy: number;
}

function hasOnlyFiniteNumbers(values: unknown): values is number[] {
  return Array.isArray(values) && values.every((value) => typeof value === "number" && Number.isFinite(value));
}

export function pairedRegressionSums(x: unknown, y: unknown): RegressionSums | null {
  if (!hasOnlyFiniteNumbers(x) || !hasOnlyFiniteNumbers(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let index = 0; index < x.length; index += 1) {
    const xValue = x[index];
    const yValue = y[index];
    sumX += xValue;
    sumY += yValue;
    sumXY += xValue * yValue;
    sumX2 += xValue * xValue;
    sumY2 += yValue * yValue;
  }

  const n = x.length;
  const meanX = sumX / n;
  const meanY = sumY / n;
  const Sxx = sumX2 - (sumX * sumX) / n;
  const Syy = sumY2 - (sumY * sumY) / n;
  const Sxy = sumXY - (sumX * sumY) / n;

  return {
    n,
    sumX,
    sumY,
    sumXY,
    sumX2,
    sumY2,
    meanX,
    meanY,
    Sxx,
    Syy,
    Sxy,
  };
}
