import { routes, url, type ArticleId, type CalculatorId, type RouteRef } from './links';

export interface BreadcrumbItem {
  label: string;
  route?: RouteRef;
}

interface ArticleSchemaInput {
  id: ArticleId;
  headline: string;
  description: string;
  datePublished?: Date | string;
  dateModified?: Date | string;
  image?: string;
}

interface WebPageSchemaInput {
  id: CalculatorId;
  name: string;
  description: string;
  datePublished?: Date | string;
  dateModified?: Date | string;
}

function absoluteRoute(ref: RouteRef, site: URL): string {
  return new URL(url(ref), site).href;
}

function absoluteAsset(asset: string, site: URL): string {
  return new URL(asset, site).href;
}

function isoDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function breadcrumbList(items: BreadcrumbItem[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      if (!item.route) {
        throw new Error(`Breadcrumb item "${item.label}" is missing a route.`);
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: absoluteRoute(item.route, site),
      };
    }),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]) {
  if (items.length === 0) {
    throw new Error('FAQPage schema requires at least one item.');
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * The named byline every guide and calculator page carries. It is a real
 * editorial group rather than a person, so it is modelled as an Organization
 * under the publisher and points at /about/, where the team, its process and
 * its corrections policy are described. One object feeds the JSON-LD, the
 * visible bylines, the footer and the contact / editorial-policy pages, so the
 * name and address cannot drift between them. No Person schema by design (the
 * site has no named individual authors) -- see ADR 0024.
 */
export const EDITORIAL_TEAM = {
  name: 'Statohub Editorial Team',
  route: routes.about(),
  description:
    'The small group that commissions, writes, checks and maintains the statistics guides and calculators on Statohub.',
  email: 'admin@statohub.com',
  /** Official brand profile URLs (e.g. X, LinkedIn). Left empty until provided. */
  sameAs: [] as string[],
} as const;

/** @deprecated Read EDITORIAL_TEAM.name; kept so older imports keep compiling. */
export const EDITORIAL_TEAM_NAME = EDITORIAL_TEAM.name;

export function editorialTeamRef(site: URL) {
  return {
    '@type': 'Organization',
    '@id': new URL('#editorial-team', site).href,
    name: EDITORIAL_TEAM.name,
    description: EDITORIAL_TEAM.description,
    url: absoluteRoute(EDITORIAL_TEAM.route, site),
    parentOrganization: { '@id': new URL('#organization', site).href },
  };
}

export function articleSchema(input: ArticleSchemaInput, site: URL) {
  const organizationRef = { '@id': new URL('#organization', site).href };
  const websiteRef = { '@id': new URL('#website', site).href };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteRoute(routes.article(input.id), site),
    author: editorialTeamRef(site),
    publisher: organizationRef,
    isPartOf: websiteRef,
  };

  if (input.datePublished) {
    schema.datePublished = isoDate(input.datePublished);
  }

  if (input.dateModified) {
    schema.dateModified = isoDate(input.dateModified);
  }

  if (input.image) {
    schema.image = absoluteAsset(input.image, site);
  }

  return schema;
}

interface OrganizationSchemaInput {
  name?: string;
  logo?: string;
  /** Official brand profile URLs (e.g. X, LinkedIn). Defaults to EDITORIAL_TEAM.sameAs. */
  sameAs?: string[];
}

interface WebSiteSchemaInput {
  name?: string;
  alternateName?: string;
}

export function organizationSchema(site: URL, input: OrganizationSchemaInput = {}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': new URL('#organization', site).href,
    name: input.name ?? 'Statohub',
    url: site.href,
    description:
      'Plain-English statistics guides paired with calculators that run in the browser, covering foundations, descriptive and inferential statistics, probability, regression, experiments and forecasting.',
    email: EDITORIAL_TEAM.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: EDITORIAL_TEAM.email,
      url: absoluteRoute(routes.contact(), site),
    },
    publishingPrinciples: absoluteRoute(routes.editorialPolicy(), site),
  };

  if (input.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: absoluteAsset(input.logo, site),
    };
  }

  const sameAs = input.sameAs ?? EDITORIAL_TEAM.sameAs;
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

export function webSiteSchema(site: URL, input: WebSiteSchemaInput = {}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('#website', site).href,
    name: input.name ?? 'Statohub',
    url: site.href,
    publisher: { '@id': new URL('#organization', site).href },
  };

  if (input.alternateName) {
    schema.alternateName = input.alternateName;
  }

  return schema;
}

export function webPageSchema(input: WebPageSchemaInput, site: URL) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: absoluteRoute(routes.calculator(input.id), site),
    isPartOf: { '@id': new URL('#website', site).href },
    author: editorialTeamRef(site),
    publisher: { '@id': new URL('#organization', site).href },
  };

  if (input.datePublished) {
    schema.datePublished = isoDate(input.datePublished);
  }

  if (input.dateModified) {
    schema.dateModified = isoDate(input.dateModified);
  }

  return schema;
}
