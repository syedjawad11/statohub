import { url, type RouteRef } from './links';

export const relatedIntroPhrases = [
  'Worth reading next',
  'On a related note',
  'You may also find this useful',
  'For a related calculation',
  'Another helpful calculator is',
  'See also',
] as const;

export type RelatedIntroPhrase = (typeof relatedIntroPhrases)[number];

export function seedFromRoute(ref: RouteRef): string {
  return 'id' in ref ? `${ref.kind}:${ref.id}` : ref.kind;
}

export function pickRelatedIntro(seed: string): RelatedIntroPhrase {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return relatedIntroPhrases[hash % relatedIntroPhrases.length];
}

export function pickRelatedIntroForRoute(ref: RouteRef): RelatedIntroPhrase {
  return pickRelatedIntro(seedFromRoute(ref) || url(ref));
}