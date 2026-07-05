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

export function articleSchema(input: ArticleSchemaInput, site: URL) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteRoute(routes.article(input.id), site),
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
  /** Official brand profile URLs (e.g. X, LinkedIn). Left empty until provided. */
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
  };

  if (input.logo) {
    schema.logo = absoluteAsset(input.logo, site);
  }

  if (input.sameAs && input.sameAs.length > 0) {
    schema.sameAs = input.sameAs;
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
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: absoluteRoute(routes.calculator(input.id), site),
  };
}
