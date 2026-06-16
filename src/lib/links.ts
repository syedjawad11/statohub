import type {
  ArticleContentId,
  CalculatorContentId,
  CategoryContentId,
} from './content-route-ids';

// Route ids are literal-union types generated from the real src/content/**
// collections by scripts/gen-route-ids.mjs (regenerated on every `npm run build`),
// so the registry has a real compile-time bite AND cannot drift from content.
//
// Why not derive from `astro:content` directly: in this Astro version the public
// CollectionEntry<C>['id'|'slug'] types collapse to `string` (the literal-bearing
// internal entry maps aren't exported), so a bogus id would NOT fail astro check.
// The codegen is the lean way to get both guarantees with no new dependency.
export type ArticleId = ArticleContentId;
export type CalculatorId = CalculatorContentId;
export type CategoryId = CategoryContentId;

export type RouteRef =
  | { kind: 'home' }
  | { kind: 'about' }
  | { kind: 'categoryHub'; id: CategoryId }
  | { kind: 'article'; id: ArticleId }
  | { kind: 'calculatorsHub' }
  | { kind: 'calculator'; id: CalculatorId };

// Single source of truth for internal page links (BUILD-PLAN B2).
// All internal hrefs and future TASK-006 JSON-LD URL fields must route through url().
export function url(ref: RouteRef): string {
  switch (ref.kind) {
    case 'home':
      return '/';
    case 'about':
      return '/about/';
    case 'categoryHub':
      return `/${ref.id}/`;
    case 'article':
      return `/${ref.id}/`;
    case 'calculatorsHub':
      return '/calculators/';
    case 'calculator':
      return `/calculators/${ref.id}/`;
  }
}

export const routes = {
  home: (): RouteRef => ({ kind: 'home' }),
  about: (): RouteRef => ({ kind: 'about' }),
  categoryHub: (id: CategoryId): RouteRef => ({ kind: 'categoryHub', id }),
  article: (id: ArticleId): RouteRef => ({ kind: 'article', id }),
  calculatorsHub: (): RouteRef => ({ kind: 'calculatorsHub' }),
  calculator: (id: CalculatorId): RouteRef => ({ kind: 'calculator', id }),
};
