export interface CalcResult {
  /** Primary numeric output; null when input is invalid/insufficient. */
  value: number | null;
  /** Optional secondary named outputs, e.g. { sample: 2.138, population: 2 }. */
  outputs?: Record<string, number>;
  /** Optional tabular output for calculators that return rows instead of one scalar. */
  table?: { columns: string[]; rows: (string | number)[][] };
  /** Optional numeric list output, e.g. detected outliers. */
  list?: number[];
  /** Optional explanatory output for non-scalar calculator details. */
  text?: string;
  /** Optional human-readable validation message when value is null. */
  error?: string;
}

/** Every engine is a pure function: structured input -> CalcResult. No I/O, no DOM. */
export type CalcEngine = (input: any) => CalcResult;
