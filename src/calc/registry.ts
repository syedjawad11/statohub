import type { CalcEngine } from './types';
import { mean } from './mean';
import { median } from './median';
import { mode } from './mode';
import { range } from './range';
import { variance } from './variance';
import { standardDeviation } from './standard-deviation';
import { meanAbsoluteDeviation } from './mean-absolute-deviation';
import { percentile } from './percentile';
import { weightedMean } from './weighted-mean';
import { zScore } from './z-score';
import { mmmr } from './mmmr';
import { rangeIqr } from './range-iqr';
import { outlier } from './outlier';
import { frequencyTable } from './frequency-table';
import { factorial } from './factorial';
import { combination } from './combination';
import { probability } from './probability';
import { binomial } from './binomial';
import { normalDistribution } from './normal-distribution';
import { zTable } from './z-table';
import { confidenceInterval } from './confidence-interval';
import { sampleSize } from './sample-size';
import { correlation } from './correlation';
import { linearRegression } from './linear-regression';
import { pValue } from './p-value';
import { tTest } from './t-test';
import { chiSquare } from './chi-square';
import { tTable } from './t-table';
import { proportion } from './proportion';

export const registry: Record<string, CalcEngine> = {
  mean,
  median,
  mode,
  range,
  variance,
  standardDeviation,
  meanAbsoluteDeviation,
  percentile,
  weightedMean,
  zScore,
  mmmr,
  'range-iqr': rangeIqr,
  outlier,
  'frequency-table': frequencyTable,
  factorial,
  combination,
  probability,
  binomial,
  'normal-distribution': normalDistribution,
  'z-table': zTable,
  'confidence-interval': confidenceInterval,
  'sample-size': sampleSize,
  correlation,
  'linear-regression': linearRegression,
  'p-value': pValue,
  't-test': tTest,
  'chi-square': chiSquare,
  't-table': tTable,
  proportion,
};

export function getEngine(key: string): CalcEngine | undefined {
  return registry[key];
}
