// Generates llms.txt from the built sitemap and HTML so the AI-facing index
// cannot drift from the exact set of published, indexable pages.
//
// Why this exists: a hand-maintained public/llms.txt silently fell behind the
// site as new content shipped. The sitemap owns URL inclusion, built metadata
// owns page copy, and article BreadcrumbList JSON-LD owns category membership.
// Category/calculator YAML supplies only the ordering and calculator grouping
// that built calculator breadcrumbs do not expose. Node built-ins only.

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SITE_ORIGIN = 'https://statohub.com';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap-index.xml`;
const distDir = path.resolve('dist');
const publicFile = path.resolve('public', 'llms.txt');
const distFile = path.join(distDir, 'llms.txt');
const categoriesDir = path.resolve('src', 'content', 'categories');
const calculatorsDir = path.resolve('src', 'content', 'calculators');

const fixedDescription = {
  learn: 'Index of the core statistics topics below.',
  applied:
    'How statistics gets used in practice: analysis workflows, experiment design, forecasting, and the statistics behind machine learning.',
  calculators: 'Full index of every Statohub calculator.',
  sitemap: 'XML sitemap index covering every indexable page.',
};

function decodeEntities(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/gi, (entity, key) => {
    if (key[0] !== '#') return named[key.toLowerCase()];
    const hex = key[1].toLowerCase() === 'x';
    return String.fromCodePoint(Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10));
  });
}

function normalizeText(value) {
  return decodeEntities(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? decodeEntities(match[2]) : null;
}

function metadataFromHtml(html, filePath) {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, 'name')?.toLowerCase() === 'description',
  )?.[0];
  const description = descriptionTag ? attribute(descriptionTag, 'content') : null;

  if (!titleMatch || description === null) {
    throw new Error(`${path.relative('.', filePath)} is missing a title or meta description`);
  }

  return {
    title: normalizeText(titleMatch[1]).replace(/ \| Statohub$/, ''),
    description: normalizeText(description),
  };
}

function urlsFromSitemap(xml) {
  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeEntities(match[1].trim()),
  );
  if (urls.length === 0) throw new Error('dist/sitemap-0.xml contains no <loc> URLs');
  return urls;
}

function htmlPathForUrl(url) {
  const parsed = new URL(url);
  if (parsed.origin !== SITE_ORIGIN) throw new Error(`unexpected sitemap origin: ${url}`);
  if (!parsed.pathname.endsWith('/')) throw new Error(`page URL must end with /: ${url}`);
  if (parsed.search || parsed.hash) throw new Error(`sitemap page URL has query/hash: ${url}`);

  const segments = parsed.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  return segments.length === 0
    ? path.join(distDir, 'index.html')
    : path.join(distDir, ...segments, 'index.html');
}

function pagesFromBuild() {
  const sitemapFile = path.join(distDir, 'sitemap-0.xml');
  if (!existsSync(sitemapFile)) throw new Error('dist/sitemap-0.xml not found; run after astro build');

  return new Map(
    urlsFromSitemap(readFileSync(sitemapFile, 'utf8')).map((url) => {
      const filePath = htmlPathForUrl(url);
      if (!existsSync(filePath)) throw new Error(`${url} has no built index.html`);
      const html = readFileSync(filePath, 'utf8');
      return [url, { url, html, ...metadataFromHtml(html, filePath) }];
    }),
  );
}

function parseScalar(raw, filePath, key) {
  const value = raw.trim();
  if (!value) throw new Error(`${filePath}: ${key} has no scalar value`);
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${filePath}: ${key} has an invalid double-quoted scalar`);
    }
  }
  if (value.startsWith("'")) {
    if (!value.endsWith("'")) throw new Error(`${filePath}: ${key} has an invalid quoted scalar`);
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value.replace(/\s+#.*$/, '').trim();
}

function parseFlatYaml(filePath) {
  const values = {};
  const lines = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) throw new Error(`${filePath}:${index + 1}: expected a flat scalar key`);
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) throw new Error(`${filePath}:${index + 1}: could not parse flat YAML scalar`);
    if (Object.hasOwn(values, match[1])) throw new Error(`${filePath}:${index + 1}: duplicate ${match[1]}`);
    values[match[1]] = parseScalar(match[2], filePath, match[1]);
  }
  return values;
}

function readCategories() {
  return readdirSync(categoriesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'))
    .map((entry) => {
      const filePath = path.join(categoriesDir, entry.name);
      const data = parseFlatYaml(filePath);
      const slug = entry.name.replace(/\.yaml$/, '');
      const order = Number(data.order);
      const section = data.section ?? 'learn';
      if (!data.title || !data.description || !Number.isInteger(order)) {
        throw new Error(`${filePath}: title, description, and integer order are required`);
      }
      if (!['learn', 'applied'].includes(section)) {
        throw new Error(`${filePath}: section must be learn or applied`);
      }
      return { slug, title: data.title, description: data.description, order, section };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug, 'en'));
}

function calculatorCategories() {
  return new Map(
    readdirSync(calculatorsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'))
      .map((entry) => {
        const filePath = path.join(calculatorsDir, entry.name);
        const categoryLine = readFileSync(filePath, 'utf8')
          .split(/\r?\n/)
          .find((line) => line.startsWith('category:'));
        if (!categoryLine) throw new Error(`${filePath}: top-level category scalar is required`);
        return [
          entry.name.replace(/\.yaml$/, ''),
          parseScalar(categoryLine.slice('category:'.length), filePath, 'category'),
        ];
      }),
  );
}

function breadcrumbCategory(page, categoriesByUrl) {
  const jsonScripts = [...page.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attribute(match[1], 'type')?.toLowerCase() === 'application/ld+json')
    .map((match) => {
      try {
        return JSON.parse(match[2]);
      } catch {
        throw new Error(`${page.url}: invalid JSON-LD in built HTML`);
      }
    });
  const breadcrumbs = jsonScripts.find((value) => value?.['@type'] === 'BreadcrumbList');
  if (!breadcrumbs || !Array.isArray(breadcrumbs.itemListElement)) {
    throw new Error(`${page.url}: built article has no BreadcrumbList JSON-LD`);
  }
  const categoryMatches = breadcrumbs.itemListElement
    .map((item) => categoriesByUrl.get(item?.item))
    .filter(Boolean);
  if (categoryMatches.length !== 1) {
    throw new Error(`${page.url}: breadcrumb must identify exactly one category`);
  }
  return categoryMatches[0];
}

function item(page, label = page.title, description = page.description) {
  return `- [${label}](${page.url}): ${description}`;
}

const pages = pagesFromBuild();
const categories = readCategories();
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
const categoryByUrl = new Map(
  categories.map((category) => [`${SITE_ORIGIN}/${category.slug}/`, category]),
);
const groupedArticles = new Map(categories.map((category) => [category.slug, []]));
const groupedCalculators = new Map(categories.map((category) => [category.slug, []]));
const consumed = new Set();

function required(url) {
  const page = pages.get(url);
  if (!page) throw new Error(`required page is absent from sitemap: ${url}`);
  consumed.add(url);
  return page;
}

const home = required(`${SITE_ORIGIN}/`);
const learn = required(`${SITE_ORIGIN}/learn/`);
const applied = required(`${SITE_ORIGIN}/applied/`);
const calculatorsHub = required(`${SITE_ORIGIN}/calculators/`);
const about = required(`${SITE_ORIGIN}/about/`);
const privacy = required(`${SITE_ORIGIN}/privacy-cookie-policy/`);

for (const category of categories) required(`${SITE_ORIGIN}/${category.slug}/`);

const calculatorCategoryBySlug = calculatorCategories();
for (const page of pages.values()) {
  const match = new URL(page.url).pathname.match(/^\/calculators\/([^/]+)\/$/);
  if (!match) continue;
  const categorySlug = calculatorCategoryBySlug.get(match[1]);
  const category = categoryBySlug.get(categorySlug);
  if (!category) throw new Error(`${page.url}: calculator has unknown category ${categorySlug}`);
  groupedCalculators.get(category.slug).push(page);
  consumed.add(page.url);
}

for (const page of pages.values()) {
  if (consumed.has(page.url)) continue;
  const category = breadcrumbCategory(page, categoryByUrl);
  groupedArticles.get(category.slug).push(page);
  consumed.add(page.url);
}

if (consumed.size !== pages.size) throw new Error('not every sitemap URL was classified');

const compareTitle = (a, b) => a.title.localeCompare(b.title, 'en');
for (const group of [...groupedArticles.values(), ...groupedCalculators.values()]) {
  group.sort(compareTitle);
}

const lines = [
  '# Statohub',
  '',
  '> Statohub (https://statohub.com/) is a statistics education site. It pairs interactive calculators that compute real results in the browser with plain-English teaching on the same page: a how-to, a worked example, and an FAQ beside every tool, plus longer articles that explain the underlying concepts. Content spans two tracks — Learn (core statistics theory and method) and Applied Statistics (how those methods are used in real analysis, experiments, forecasting, and machine learning).',
  '',
  'Key facts for AI assistants citing this site:',
  '',
  '- All content is original teaching material written for students, self-learners, and working analysts.',
  '- Calculators run entirely client-side and show step-by-step results alongside a worked example. No sign-up, no account, no data leaves the browser.',
  '- URLs are flat and always end in a trailing slash. Articles live at `/{slug}/`, category hubs at `/{category}/`, and standalone calculators at `/calculators/{slug}/`.',
  '- Contact: admin@statohub.com',
  '',
  item(home, 'Statohub home'),
];

for (const section of ['learn', 'applied']) {
  lines.push('', section === 'learn' ? '## Learn' : '## Applied Statistics', '');
  lines.push(
    section === 'learn'
      ? item(learn, 'Learn hub', fixedDescription.learn)
      : item(applied, 'Applied Statistics hub', fixedDescription.applied),
  );
  for (const category of categories.filter((entry) => entry.section === section)) {
    const hub = pages.get(`${SITE_ORIGIN}/${category.slug}/`);
    lines.push('', `### ${category.title}`, '', item(hub, `${hub.title} hub`));
    lines.push(...groupedArticles.get(category.slug).map((page) => item(page)));
  }
}

lines.push('', '## Calculators', '', item(calculatorsHub, 'All calculators', fixedDescription.calculators));
for (const category of categories) {
  const calculatorPages = groupedCalculators.get(category.slug);
  if (calculatorPages.length === 0) continue;
  lines.push('', `### ${category.title}`, '', ...calculatorPages.map((page) => item(page)));
}

lines.push(
  '',
  '## Optional',
  '',
  item(about, 'About'),
  item(privacy, 'Privacy & Cookie Policy'),
  `- [Sitemap](${SITEMAP_URL}): ${fixedDescription.sitemap}`,
  '',
);

const output = lines.join('\n');
writeFileSync(distFile, output, 'utf8');
writeFileSync(publicFile, output, 'utf8');

console.log(
  `gen-llms-txt: wrote ${pages.size} sitemap pages to dist/llms.txt and public/llms.txt.`,
);
