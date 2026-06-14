import { describe, expect, it } from 'vitest';
import { getEngine, registry } from '../registry';

const values = [2, 4, 4, 4, 5, 5, 7, 9];

describe('registry', () => {
  it('exposes the standardDeviation engine for calculator configs', () => {
    expect(getEngine('standardDeviation')).toBeTypeOf('function');

    const result = registry.standardDeviation({ values });

    expect(result.value).toBeCloseTo(2.1380899);
    expect(result.outputs?.population).toBe(2);
  });
});
