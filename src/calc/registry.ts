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
};

export function getEngine(key: string): CalcEngine | undefined {
  return registry[key];
}
