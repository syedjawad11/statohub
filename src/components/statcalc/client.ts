import { getEngine } from '../../calc/registry';
import type { CalcResult } from '../../calc/types';
import { formatNumber, parseNumber, parseNumberList } from './format';

type InputSpec = {
  name: string;
  label: string;
  type: 'numberList' | 'number';
};

type StatCalcConfig = {
  engine: string;
  inputs: InputSpec[];
  precision: number;
  resultLabel?: string;
  outputLabels?: Record<string, string>;
  chart?: boolean;
};

const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const renderError = (target: HTMLElement, message: string) => {
  target.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'font-medium text-red-700 dark:text-red-300';
  p.textContent = message;
  target.append(p);
};

const renderResults = (target: HTMLElement, result: CalcResult, config: StatCalcConfig) => {
  target.innerHTML = '';

  if (result.value === null) {
    renderError(target, result.error ?? 'Enter enough valid values to compute a result.');
    return;
  }

  const outputs = result.outputs ? Object.entries(result.outputs) : [];
  const rows = outputs.length > 0
    ? outputs.map(([key, value]) => [config.outputLabels?.[key] ?? humanize(key), value] as const)
    : [[config.resultLabel ?? 'Result', result.value] as const];

  const dl = document.createElement('dl');
  dl.className = 'space-y-3';

  for (const [label, value] of rows) {
    const row = document.createElement('div');
    row.className = 'flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between';

    const dt = document.createElement('dt');
    dt.className = 'font-medium text-slate-700 dark:text-slate-300';
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.className = 'text-lg font-semibold text-slate-950 dark:text-white';
    dd.textContent = formatNumber(value, config.precision);

    row.append(dt, dd);
    dl.append(row);
  }

  target.append(dl);
};

const readConfig = (root: HTMLElement): StatCalcConfig | null => {
  const configId = root.dataset.configId;
  if (!configId) return null;

  const script = document.getElementById(configId);
  if (!script?.textContent) return null;

  return JSON.parse(script.textContent) as StatCalcConfig;
};

const buildInput = (form: HTMLFormElement, config: StatCalcConfig) => {
  const formData = new FormData(form);
  const input: Record<string, number | number[]> = {};

  for (const spec of config.inputs) {
    const raw = String(formData.get(spec.name) ?? '');
    input[spec.name] = spec.type === 'numberList' ? parseNumberList(raw) : parseNumber(raw);
  }

  return input;
};

const initStatCalc = (root: HTMLElement) => {
  if (root.dataset.statcalcReady === 'true') return;
  root.dataset.statcalcReady = 'true';

  const config = readConfig(root);
  const form = root.querySelector<HTMLFormElement>('[data-statcalc-form]');
  const results = root.querySelector<HTMLElement>('[data-statcalc-results]');

  if (!config || !form || !results) return;

  const engine = getEngine(config.engine);
  if (!engine) {
    renderError(results, `Calculator engine not found: ${config.engine}`);
    return;
  }

  const compute = () => {
    const result = engine(buildInput(form, config));
    renderResults(results, result, config);

    if (config.chart) {
      // Future chart seam: lazy-import uPlot only when a chart-enabled config exists.
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    compute();
  });

  form.addEventListener('input', compute);
};

document.querySelectorAll<HTMLElement>('[data-statcalc]').forEach(initStatCalc);
